import { useDoc } from '@docusaurus/plugin-content-docs/client';

interface PageContentResult {
  isChapterPage: boolean;
  pagePath: string;
  pageTitle: string;
}

export function usePageContent(): PageContentResult {
  const { metadata } = useDoc();

  // Get the source file path from metadata
  const sourcePath = metadata.source;

  // Check if this is a Topic-level page (not a Part or Chapter index)
  // Structure: Parts contain Chapters, Chapters contain Topics
  // - Parts have README.md files
  // - Chapters have readme.md files
  // - Topics are individual .md files (not README.md or readme.md)
  // - Also exclude the Welcome page (preface-agent-native.md)
  const isTopicPage = /^@site\/docs\//.test(sourcePath) &&
    !sourcePath.endsWith('README.md') &&
    !sourcePath.endsWith('readme.md') &&
    !sourcePath.endsWith('preface-agent-native.md');

  // Get clean page path for summary storage
  const pagePath = metadata.source.replace('@site/', '').replace(/\\/g, '/');

  // Get page title
  const pageTitle = metadata.title || '';

  return {
    isChapterPage: isTopicPage, // Renamed internally but keeping the same property name for compatibility
    pagePath,
    pageTitle,
  };
}
