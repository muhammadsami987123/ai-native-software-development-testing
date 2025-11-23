import { LevelOption } from '../types';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

/**
 * Check if the current URL path has nested sub-chapters
 * This determines whether Level 2 (Chapter Level) should be available
 */
function hasNestedChapters(pathname: string): boolean {
  if (!pathname.includes('/docs/')) {
    return false;
  }

  const pathParts = pathname.split('/').filter(Boolean);
  if (pathParts.length < 2 || pathParts[0] !== 'docs') {
    return false;
  }

  // Define the structure - which paths have nested chapters
  // This matches the hardcoded demo data in buildGraph.ts
  const structureMap: { [key: string]: boolean } = {
    // Parts (have chapters)
    'Introducing-AI-Driven-Development': true,
    'AI-Tool-Landscape': true,
    'Markdown-Prompt-Context-Engineering': true,
    'Python-Fundamentals': true,
    'Spec-Driven-Development': true,

    // Chapters (have lessons/sub-chapters)
    'ai-development-revolution': true,
    'ai-turning-point': false, // No lessons in demo data
    'billion-dollar-ai': false,
    'nine-pillars': false,
    'claude-code-features-and-workflows': false,

    // Lessons (no sub-lessons, only ToC)
    'moment_that_changed_everything': false,
    'three-trillion-developer-economy': false,
    'software-disrupting-itself': false,
    'development-lifecycle-transition': false,
    'beyond-code-changing-roles': false,
    'autonomous-agent-era': false,
    'opportunity-window': false,
    'traditional-cs-education-gaps': false,
  };

  // Get the current endpoint (last segment of URL)
  const currentEndpoint = pathParts[pathParts.length - 1];

  // Check if this endpoint has nested chapters
  return structureMap[currentEndpoint] === true;
}

/**
 * Dynamically detect available hierarchy levels based on current URL
 * 3-Level System:
 * - Level 1: Book Level (always available) - Full nested tree: Parts → Chapters → Nested Chapters → ToC
 * - Level 2: Chapter Level (only if current endpoint has nested chapters) - Current chapter + nested chapters (NO ToC)
 * - Level 3: Page Level (only if on a specific page with headings) - Page Table of Contents (all heading levels)
 */
export function detectAvailableLevels(): LevelOption[] {
  if (!ExecutionEnvironment.canUseDOM) {
    return [];
  }

  const levels: LevelOption[] = [];
  const pathname = window.location.pathname;

  try {
    // Level 1: Book Level - ALWAYS AVAILABLE
    levels.push({
      value: 1,
      label: '📚 Book Level',
      description: 'Complete book hierarchy (Parts → Chapters → Lessons → ToC)',
    });

    // Level 2: Chapter Level - Only if current URL endpoint HAS nested sub-chapters
    // Uses content-based check (not URL depth)
    if (hasNestedChapters(pathname)) {
      levels.push({
        value: 2,
        label: '📖 Chapter Level',
        description: 'Current chapter + nested sub-chapters (NO ToC)',
      });
    }

    // Level 3: Page TOC - Only if we're on a specific page (and it has headings)
    // For now, always show if we're on a docs page (actual ToC check happens in buildGraph.ts)
    if (pathname.includes('/docs/')) {
      const pathParts = pathname.split('/').filter(Boolean);
      // Show Level 3 if we're at least 2 levels deep (not just /docs/)
      if (pathParts.length >= 3 && pathParts[0] === 'docs') {
        levels.push({
          value: 3,
          label: '📄 Page TOC',
          description: 'Table of Contents from current page',
        });
      }
    }
  } catch (error) {
    console.error('Error detecting levels:', error);
    // Fallback to Book Level only
    return [
      {
        value: 1,
        label: '📚 Book Level',
        description: 'Complete book hierarchy',
      },
    ];
  }

  return levels;
}

/**
 * Get the current page context to determine which level to show
 * Returns the current part, chapter, and page from the URL
 */
export function getCurrentPageContext(): {
  part: string | null;
  chapter: string | null;
  page: string | null;
  isDocPage: boolean;
  urlDepth: number;
} {
  if (!ExecutionEnvironment.canUseDOM) {
    return { part: null, chapter: null, page: null, isDocPage: false, urlDepth: 0 };
  }

  try {
    const pathname = window.location.pathname;

    // Check if we're on a docs page
    if (!pathname.includes('/docs/')) {
      return { part: null, chapter: null, page: null, isDocPage: false, urlDepth: 0 };
    }

    // Extract path segments
    // Example: /docs/Introducing-AI-Driven-Development/ai-development-revolution/moment_that_changed_everything
    const pathParts = pathname.split('/').filter(Boolean);

    if (pathParts.length >= 2 && pathParts[0] === 'docs') {
      const part = pathParts[1] || null;
      const chapter = pathParts[2] || null;
      const page = pathParts[3] || null;
      const urlDepth = pathParts.length - 1; // Subtract 'docs' from count

      return {
        part,
        chapter,
        page,
        isDocPage: true,
        urlDepth,
      };
    }
  } catch (error) {
    console.error('Error getting page context:', error);
  }

  return { part: null, chapter: null, page: null, isDocPage: false, urlDepth: 0 };
}
