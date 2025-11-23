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

  // Check if this is a documentation page (any page under /docs/)
  // This ensures the summary appears on ALL documentation pages, not just numbered chapters
  const isChapterPage = /^@site\/docs\//.test(sourcePath);

  // Get clean page path for summary storage
  const pagePath = metadata.source.replace('@site/', '').replace(/\\/g, '/');

  // Get page title
  const pageTitle = metadata.title || '';

  return {
    isChapterPage,
    pagePath,
    pageTitle,
  };
}
