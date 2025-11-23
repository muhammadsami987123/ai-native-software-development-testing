import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class ProjectContextIndexer {
  constructor() {
    // Paths relative to the server directory
    this.projectRoot = path.join(__dirname, '../../');
    this.docsPath = path.join(this.projectRoot, 'docs');
    this.srcPath = path.join(this.projectRoot, 'src');
    this.contextPath = path.join(this.projectRoot, '../context');
    this.specsPath = path.join(this.projectRoot, '../specs');

    // Cache for indexed content
    this.indexCache = null;
    this.cacheTimestamp = null;
    this.cacheTTL = 5 * 60 * 1000; // 5 minutes
  }

  async getRelevantContext(query) {
    try {
      // Get or refresh index
      const index = await this.getIndex();

      // Simple keyword matching to find relevant files
      const queryLower = query.toLowerCase();
      const queryWords = queryLower.split(/\s+/).filter(w => w.length > 2);

      const relevantFiles = [];

      for (const file of index.files) {
        let score = 0;
        const contentLower = file.content.toLowerCase();
        const pathLower = file.path.toLowerCase();

        // Score based on keyword matches
        for (const word of queryWords) {
          if (contentLower.includes(word)) {
            score += 2;
          }
          if (pathLower.includes(word)) {
            score += 3;
          }
        }

        if (score > 0) {
          relevantFiles.push({ ...file, score });
        }
      }

      // Sort by score and take top 5
      relevantFiles.sort((a, b) => b.score - a.score);
      const topFiles = relevantFiles.slice(0, 5);

      // Build context summary
      const summary = topFiles
        .map(f => `File: ${f.path}\nContent preview: ${f.content.substring(0, 300)}...`)
        .join('\n\n---\n\n');

      return {
        summary: summary || 'No specific context found. General project knowledge available.',
        content: summary,
        files: topFiles.map(f => ({
          path: f.path,
          title: f.title,
          score: f.score
        })),
        totalFiles: index.files.length
      };
    } catch (error) {
      console.error('Error in ProjectContextIndexer.getRelevantContext:', error);
      return {
        summary: 'Error loading project context. Using general knowledge.',
        content: '',
        files: [],
        totalFiles: 0
      };
    }
  }

  async getIndex() {
    // Return cached index if still valid
    if (this.indexCache && this.cacheTimestamp) {
      const age = Date.now() - this.cacheTimestamp;
      if (age < this.cacheTTL) {
        return this.indexCache;
      }
    }

    // Build new index
    const index = {
      files: [],
      lastUpdated: new Date().toISOString()
    };

    try {
      // Index documentation files
      await this.indexDirectory(this.docsPath, index, ['.md', '.mdx', '.tsx', '.ts', '.js']);

      // Index source files
      await this.indexDirectory(this.srcPath, index, ['.tsx', '.ts', '.js', '.css']);

      // Index context files
      if (await this.pathExists(this.contextPath)) {
        await this.indexDirectory(this.contextPath, index, ['.md', '.py', '.json']);
      }

      // Index specs
      if (await this.pathExists(this.specsPath)) {
        await this.indexDirectory(this.specsPath, index, ['.md', '.yml', '.yaml']);
      }

      // Cache the index
      this.indexCache = index;
      this.cacheTimestamp = Date.now();

      console.log(`📚 Indexed ${index.files.length} project files`);
    } catch (error) {
      console.error('Error building index:', error);
    }

    return index;
  }

  async indexDirectory(dirPath, index, extensions = ['.md', '.tsx', '.ts', '.js']) {
    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);

        // Skip node_modules and other ignored directories
        if (entry.name.startsWith('.') ||
          entry.name === 'node_modules' ||
          entry.name === 'build' ||
          entry.name === '.docusaurus') {
          continue;
        }

        if (entry.isDirectory()) {
          await this.indexDirectory(fullPath, index, extensions);
        } else if (entry.isFile()) {
          const ext = path.extname(entry.name);
          if (extensions.includes(ext)) {
            try {
              const content = await fs.readFile(fullPath, 'utf-8');
              const relativePath = path.relative(this.projectRoot, fullPath);

              index.files.push({
                path: relativePath,
                title: this.extractTitle(content, entry.name),
                content: content.substring(0, 5000), // Limit content size
                extension: ext
              });
            } catch (err) {
              // Skip files that can't be read
              console.warn(`Could not read file: ${fullPath}`);
            }
          }
        }
      }
    } catch (error) {
      // Directory might not exist, skip silently
      if (error.code !== 'ENOENT') {
        console.warn(`Could not index directory: ${dirPath}`, error.message);
      }
    }
  }

  extractTitle(content, filename) {
    // Try to extract title from frontmatter or first heading
    const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);
    if (frontmatterMatch) {
      const titleMatch = frontmatterMatch[1].match(/title:\s*(.+)/);
      if (titleMatch) {
        return titleMatch[1].trim().replace(/['"]/g, '');
      }
    }

    // Try markdown heading
    const headingMatch = content.match(/^#+\s+(.+)$/m);
    if (headingMatch) {
      return headingMatch[1].trim();
    }

    // Fallback to filename
    return path.basename(filename, path.extname(filename));
  }

  async pathExists(filePath) {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }
}
