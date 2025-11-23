import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class SummaryService {
  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not set in environment variables');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    this.summaryDir = path.join(__dirname, '../../summary');
  }

  async ensureSummaryDirectory() {
    try {
      await fs.mkdir(this.summaryDir, { recursive: true });
    } catch (error) {
      console.error('Error creating summary directory:', error);
    }
  }

  getSummaryFilePath(pagePath, size = 'medium') {
    // Convert page path to a safe filename
    // e.g., "docs/01-Introducing-AI-Driven-Development/01-ai-development-revolution/readme.md"
    // becomes "01-Introducing-AI-Driven-Development__01-ai-development-revolution__readme__medium.json"
    const sanitized = pagePath
      .replace(/^docs\//, '') // Remove leading "docs/"
      .replace(/\//g, '__')    // Replace / with __
      .replace(/\.md$/, '')    // Remove .md extension
      + `__${size}.json`;

    return path.join(this.summaryDir, sanitized);
  }

  async getSummary(pagePath, size = 'medium') {
    try {
      await this.ensureSummaryDirectory();
      const filePath = this.getSummaryFilePath(pagePath, size);

      const content = await fs.readFile(filePath, 'utf-8');
      const data = JSON.parse(content);

      return data.summary;
    } catch (error) {
      if (error.code === 'ENOENT') {
        // File doesn't exist, return null
        return null;
      }
      throw error;
    }
  }

  async saveSummary(pagePath, summary, size = 'medium') {
    try {
      await this.ensureSummaryDirectory();
      const filePath = this.getSummaryFilePath(pagePath, size);

      const data = {
        pagePath,
        summary,
        size,
        generatedAt: new Date().toISOString()
      };

      await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');

      return true;
    } catch (error) {
      console.error('Error saving summary:', error);
      throw error;
    }
  }

  async readMarkdownFile(pagePath) {
    try {
      // pagePath is like "docs/01-Introducing-AI-Driven-Development/01-ai-development-revolution/readme.md"
      const fullPath = path.join(__dirname, '../../', pagePath);
      const content = await fs.readFile(fullPath, 'utf-8');
      return content;
    } catch (error) {
      console.error('Error reading markdown file:', error);
      throw new Error(`Failed to read file: ${error.message}`);
    }
  }

  async generateSummary(pagePath, pageTitle, size = 'short') {
    try {
      console.log('\n🎯 [Service] generateSummary called with:', {
        pagePath,
        pageTitle,
        size,
      });

      // Map size to format configurations - Always use detailed Markdown format
      const sizeConfig = {
        bulleted: {
          format: 'markdown',
          instruction: 'Create a comprehensive summary using proper Markdown formatting. Include multiple sections with headings (##), bullet points (-), and clear structure. The longer the original content, the more detailed the summary should be.',
          wordLimit: null,
        },
        short: {
          format: 'markdown',
          instruction: 'Create a detailed summary using proper Markdown formatting. Include headings (##), bullet points (-), and structured sections. Aim for 300-500 words with clear organization.',
          wordLimit: 500,
        },
        long: {
          format: 'markdown',
          instruction: 'Create a comprehensive, detailed summary using proper Markdown formatting. Include multiple sections with headings (##), sub-headings (###), bullet points (-), and thorough explanations. The summary should be proportional to the original content length - longer content should have more detailed summaries. Aim for 600-1000 words with excellent structure and clarity.',
          wordLimit: 1000,
        }
      };

      const config = sizeConfig[size] || sizeConfig['short'];

      console.log('⚙️ [Service] Using config:', {
        size,
        format: config.format,
        wordLimit: config.wordLimit,
      });

      // Check if summary already exists for this size
      const existingSummary = await this.getSummary(pagePath, size);
      if (existingSummary) {
        console.log(`✅ [Service] Summary already exists for ${pagePath} (${size}), returning cached version`);
        const stats = config.format === 'bulleted'
          ? `${this.countBulletPoints(existingSummary)} bullet points`
          : `${this.countWords(existingSummary)} words`;
        console.log(`📊 [Service] Cached summary has ${stats}`);
        return existingSummary;
      }

      console.log('🆕 [Service] No cache found, generating new summary...');

      // Read the raw markdown file from filesystem
      const pageContent = await this.readMarkdownFile(pagePath);

      // Generate Markdown-formatted prompt
      const prompt = `You are an expert technical summarizer. Create a comprehensive, well-structured summary of the following content.

===== CRITICAL FORMATTING RULES =====

1. USE PROPER MARKDOWN:
   - Use ## for main section headings
   - Use ### for sub-sections
   - Use - for bullet points
   - Use **bold** for emphasis on key terms
   - Use \`code\` for technical terms and code references
   - Create clear, logical sections

2. STRUCTURE REQUIREMENTS:
   - Start with a brief overview paragraph
   - Organize content into logical sections with headings
   - Use bullet points for lists of features, concepts, or steps
   - Include concrete examples where relevant
   - End with key takeaways or implications

3. CONTENT DEPTH:
   - ${config.instruction}
   - Scale detail based on source content length
   - Include all important concepts and details
   - Maintain technical accuracy
   - Use clear, professional language

4. WHAT TO AVOID:
   - No meta-commentary ("This document discusses...")
   - No introductory phrases ("In summary...")
   - No repetition
   - No vague statements

===== CONTENT TO SUMMARIZE =====
${pageContent}

===== YOUR TASK =====
Create a detailed, well-structured Markdown summary following all rules above.

OUTPUT (Markdown format):`;

      console.log('🤖 [Service] Calling Gemini AI...');

      const result = await this.model.generateContent(prompt);
      const response = result.response;
      let summary = response.text().trim();

      console.log('📝 [Service] Raw AI response length:', summary.length);
      console.log('📝 [Service] Raw AI response preview:', summary.substring(0, 300) + '...');

      // Clean up the Markdown but preserve formatting
      summary = this.cleanMarkdownSummary(summary);

      const wordCount = this.countWords(summary);
      console.log(`📊 [Service] Markdown summary has ${wordCount} words`);
      console.log('✅ [Service] Final summary preview:', summary.substring(0, 300) + '...');

      // Save the generated summary
      await this.saveSummary(pagePath, summary, size);

      console.log(`✓ Generated and saved ${size} Markdown summary (${wordCount} words) for ${pagePath}`);

      return summary;
    } catch (error) {
      console.error('Error generating summary with Gemini:', error);
      throw new Error(`Failed to generate summary: ${error.message}`);
    }
  }

  stripMarkdown(text) {
    let clean = text;

    // Remove headings (# ## ###)
    clean = clean.replace(/^#+\s+/gm, '');

    // Remove bold/italic (** __ * _)
    clean = clean.replace(/(\*\*|__)(.*?)\1/g, '$2');
    clean = clean.replace(/(\*|_)(.*?)\1/g, '$2');

    // Remove bullet points (- * +)
    clean = clean.replace(/^[\s]*[-*+]\s+/gm, '');

    // Remove numbered lists (1. 2. etc)
    clean = clean.replace(/^\d+\.\s+/gm, '');

    // Remove code blocks (``` or `)
    clean = clean.replace(/`{3}[\s\S]*?`{3}/g, '');
    clean = clean.replace(/`([^`]+)`/g, '$1');

    // Remove links [text](url)
    clean = clean.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');

    // Remove tables
    clean = clean.replace(/\|.*\|/g, '');
    clean = clean.replace(/^\|.*$/gm, '');

    // Remove multiple newlines
    clean = clean.replace(/\n{2,}/g, ' ');

    // Remove extra whitespace
    clean = clean.replace(/\s+/g, ' ');

    return clean.trim();
  }

  countSentences(text) {
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
    return sentences.length;
  }

  enforceSentenceCount(text, targetCount) {
    // Split by sentence-ending punctuation (., !, ?)
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [];

    // Remove empty or whitespace-only sentences
    const validSentences = sentences
      .map(s => s.trim())
      .filter(s => s.length > 0);

    // Truncate to target count if too long
    if (validSentences.length > targetCount) {
      return validSentences.slice(0, targetCount).join(' ');
    }

    // Return as-is if correct count or too short (we trust AI for correct generation)
    return validSentences.join(' ');
  }

  countWords(text) {
    // Split by whitespace and filter out empty strings
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    return words.length;
  }

  enforceWordLimit(text, maxWords) {
    const words = text.trim().split(/\s+/);

    if (words.length <= maxWords) {
      return text;
    }

    // Truncate to word limit
    const truncated = words.slice(0, maxWords);
    let result = truncated.join(' ');

    // Ensure it ends with proper punctuation
    if (!/[.!?]$/.test(result)) {
      result += '.';
    }

    return result;
  }

  countBulletPoints(text) {
    // Count lines that start with "- " (markdown bullets)
    const bullets = text.split('\n').filter(line => line.trim().startsWith('- '));
    return bullets.length;
  }

  cleanMarkdownSummary(text) {
    let clean = text;

    // Remove code block markers but keep content
    clean = clean.replace(/```[\w]*\n/g, '');
    clean = clean.replace(/```/g, '');

    // Remove excessive blank lines (more than 2)
    clean = clean.replace(/\n{3,}/g, '\n\n');

    // Trim whitespace
    clean = clean.trim();

    return clean;
  }

  cleanBulletedSummary(text) {
    // Split into lines and process each
    const lines = text.split('\n');
    const cleanedLines = [];

    for (const line of lines) {
      const trimmed = line.trim();

      // Skip empty lines
      if (!trimmed) continue;

      // Ensure line starts with "- "
      if (trimmed.startsWith('- ')) {
        cleanedLines.push(trimmed);
      } else if (trimmed.startsWith('-')) {
        // Fix missing space after dash
        cleanedLines.push('- ' + trimmed.substring(1).trim());
      } else if (trimmed.startsWith('* ')) {
        // Convert asterisk to dash
        cleanedLines.push('- ' + trimmed.substring(2));
      } else if (trimmed.startsWith('•')) {
        // Convert bullet character to dash
        cleanedLines.push('- ' + trimmed.substring(1).trim());
      } else {
        // Line doesn't start with bullet marker - add one
        cleanedLines.push('- ' + trimmed);
      }
    }

    return cleanedLines.join('\n');
  }
}

const summaryService = new SummaryService();

export async function generateSummary(pagePath, pageTitle, size = 'short') {
  return await summaryService.generateSummary(pagePath, pageTitle, size);
}

export async function getSummary(pagePath, size = 'short') {
  return await summaryService.getSummary(pagePath, size);
}

export { SummaryService as SummaryServiceClass };
