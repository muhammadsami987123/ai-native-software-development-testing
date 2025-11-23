import { Node, Edge, MarkerType } from '@xyflow/react';
import { HierarchyNode } from '../types';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

/**
 * Build a hierarchical tree from Docusaurus sidebar data
 */
export function buildHierarchyFromSidebar(level: number): HierarchyNode[] {
  if (!ExecutionEnvironment.canUseDOM) {
    return [];
  }

  try {
    // Get the global Docusaurus data
    const globalData = (window as any).docusaurus;

    if (!globalData) {
      console.warn('Docusaurus global data not available');
      return getDemoData(level);
    }

    // For now, we'll use demo data since we need to properly access sidebar structure
    // In a real implementation, you'd parse the actual sidebar configuration
    return getDemoData(level);
  } catch (error) {
    console.error('Error building hierarchy:', error);
    return getDemoData(level);
  }
}

/**
 * Demo data for 3-level mindmap system
 * Level 1: Book Level - Full nested tree (Parts → Chapters → Nested Chapters)
 * Level 2: Chapter Level - Current chapter + nested chapters
 * Level 3: Page Level - Page Table of Contents (all heading levels h1-h6)
 */
function getDemoData(level: number): HierarchyNode[] {
  const pathname = ExecutionEnvironment.canUseDOM ? window.location.pathname : '';

  if (level === 1) {
    // LEVEL 1: Book Level - Complete hierarchy: Parts → Chapters → Lessons → ToC headings from every page
    return [
      {
        id: 'part-1',
        label: 'Part 1: Introducing AI-Driven Development',
        level: 1,
        url: '/docs/Introducing-AI-Driven-Development',
        children: [
          {
            id: 'ch-1-1',
            label: 'Chapter 1: AI Development Revolution',
            level: 2,
            url: '/docs/Introducing-AI-Driven-Development/ai-development-revolution',
            children: [
              {
                id: 'lesson-1-1',
                label: 'Lesson 1: The Moment That Changed Everything',
                level: 3,
                url: '/docs/Introducing-AI-Driven-Development/ai-development-revolution/moment_that_changed_everything',
                children: [
                  { id: 'toc-1-1-1', label: 'Introduction', level: 2, children: [] },
                  { id: 'toc-1-1-2', label: 'The Transformation', level: 2, children: [] },
                ],
              },
              {
                id: 'lesson-1-2',
                label: 'Lesson 2: Three Trillion Developer Economy',
                level: 3,
                url: '/docs/Introducing-AI-Driven-Development/ai-development-revolution/three-trillion-developer-economy',
                children: [
                  { id: 'toc-1-2-1', label: 'Economic Impact', level: 2, children: [] },
                  { id: 'toc-1-2-2', label: 'Future Outlook', level: 2, children: [] },
                ],
              },
            ],
          },
          {
            id: 'ch-1-2',
            label: 'Chapter 2: The AI Turning Point',
            level: 2,
            url: '/docs/Introducing-AI-Driven-Development/ai-turning-point',
            children: [],
          },
        ],
      },
      {
        id: 'part-2',
        label: 'Part 2: AI Tool Landscape',
        level: 1,
        url: '/docs/AI-Tool-Landscape',
        children: [
          {
            id: 'ch-2-1',
            label: 'Chapter 5: Claude Code Features',
            level: 2,
            url: '/docs/AI-Tool-Landscape/claude-code-features-and-workflows',
            children: [],
          },
        ],
      },
    ];
  } else if (level === 2) {
    // LEVEL 2: Chapter Level - Root based on current URL path + nested chapters ONLY (NO ToC)
    // Example: If URL is /docs/part/chapter/sub, root is "sub" and shows its nested sub-chapters
    const pathParts = pathname.split('/').filter(Boolean);

    if (pathParts.length >= 2 && pathParts[0] === 'docs') {
      // Determine the current root based on URL depth
      // URL: /docs/abc/xc/vsf → root should be "vsf" (last segment)
      const currentRoot = pathParts[pathParts.length - 1];

      // Example: If we're at /docs/Introducing-AI-Driven-Development/ai-development-revolution/
      // Root is "ai-development-revolution" and we show all lessons under it (NO ToC)
      if (currentRoot === 'ai-development-revolution' || pathParts.includes('ai-development-revolution')) {
        // Return nested chapters (lessons) under this chapter - NO ToC
        return [
          {
            id: 'lesson-1',
            label: 'Lesson 1: The Moment That Changed Everything',
            level: 3,
            url: '/docs/Introducing-AI-Driven-Development/ai-development-revolution/moment_that_changed_everything',
            children: [], // NO ToC children
          },
          {
            id: 'lesson-2',
            label: 'Lesson 2: Three Trillion Developer Economy',
            level: 3,
            url: '/docs/Introducing-AI-Driven-Development/ai-development-revolution/three-trillion-developer-economy',
            children: [],
          },
          {
            id: 'lesson-3',
            label: 'Lesson 3: Software Disrupting Itself',
            level: 3,
            url: '/docs/Introducing-AI-Driven-Development/ai-development-revolution/software-disrupting-itself',
            children: [],
          },
          {
            id: 'lesson-4',
            label: 'Lesson 4: Development Lifecycle Transition',
            level: 3,
            url: '/docs/Introducing-AI-Driven-Development/ai-development-revolution/development-lifecycle-transition',
            children: [],
          },
          {
            id: 'lesson-5',
            label: 'Lesson 5: Beyond Code - Changing Roles',
            level: 3,
            url: '/docs/Introducing-AI-Driven-Development/ai-development-revolution/beyond-code-changing-roles',
            children: [],
          },
          {
            id: 'lesson-6',
            label: 'Lesson 6: Autonomous Agent Era',
            level: 3,
            url: '/docs/Introducing-AI-Driven-Development/ai-development-revolution/autonomous-agent-era',
            children: [],
          },
          {
            id: 'lesson-7',
            label: 'Lesson 7: Opportunity Window',
            level: 3,
            url: '/docs/Introducing-AI-Driven-Development/ai-development-revolution/opportunity-window',
            children: [],
          },
          {
            id: 'lesson-8',
            label: 'Lesson 8: Traditional CS Education Gaps',
            level: 3,
            url: '/docs/Introducing-AI-Driven-Development/ai-development-revolution/traditional-cs-education-gaps',
            children: [],
          },
        ];
      }

      // If we're at a specific part level like /docs/Introducing-AI-Driven-Development/
      if (currentRoot === 'Introducing-AI-Driven-Development' || pathParts.includes('Introducing-AI-Driven-Development')) {
        // Show all chapters under this part
        return [
          {
            id: 'ch-1-1',
            label: 'Chapter 1: AI Development Revolution',
            level: 2,
            url: '/docs/Introducing-AI-Driven-Development/ai-development-revolution',
            children: [],
          },
          {
            id: 'ch-1-2',
            label: 'Chapter 2: The AI Turning Point',
            level: 2,
            url: '/docs/Introducing-AI-Driven-Development/ai-turning-point',
            children: [],
          },
          {
            id: 'ch-1-3',
            label: 'Chapter 3: The Billion Dollar Question',
            level: 2,
            url: '/docs/Introducing-AI-Driven-Development/billion-dollar-ai',
            children: [],
          },
          {
            id: 'ch-1-4',
            label: 'Chapter 4: The Nine Pillars',
            level: 2,
            url: '/docs/Introducing-AI-Driven-Development/nine-pillars',
            children: [],
          },
        ];
      }

      // Fallback: If no nested chapters found, return empty
      return [];
    }

    return [];
  } else if (level === 3) {
    // LEVEL 3: Page TOC - Table of contents of current page (ALL heading levels h1-h6)
    try {
      const tocModule = require('@docusaurus/plugin-content-docs/client');
      const docContext = tocModule.useDoc?.();

      if (docContext?.toc) {
        // Return ALL TOC items (Docusaurus already includes all heading levels)
        return docContext.toc.map((item: any, index: number) => ({
          id: item.id || `toc-${index}`,
          label: item.value,
          level: item.level, // This includes all h1-h6 levels
          children: [],
        }));
      }
    } catch (e) {
      console.warn('Could not load TOC data');
    }

    // Fallback demo TOC data with multiple heading levels
    return [
      {
        id: 'toc-1',
        label: 'Introduction',
        level: 2,
        children: [],
      },
      {
        id: 'toc-2',
        label: 'Background',
        level: 3,
        children: [],
      },
      {
        id: 'toc-3',
        label: 'Main Content',
        level: 2,
        children: [],
      },
      {
        id: 'toc-4',
        label: 'Subsection A',
        level: 3,
        children: [],
      },
      {
        id: 'toc-5',
        label: 'Detail Point',
        level: 4,
        children: [],
      },
      {
        id: 'toc-6',
        label: 'Conclusion',
        level: 2,
        children: [],
      },
    ];
  }

  return [];
}

/**
 * Convert hierarchy data to ReactFlow nodes and edges
 * Handles 3-level system with nested structures
 */
export function hierarchyToGraph(
  hierarchy: HierarchyNode[],
  level: number
): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  // Create root node with strong contrast
  const rootNode: Node = {
    id: 'root',
    type: 'input',
    data: { label: getLevelRootLabel(level) },
    position: { x: 400, y: 50 },
    style: {
      background: 'linear-gradient(135deg, #5b21b6 0%, #7c3aed 100%)', // Purple gradient
      color: '#ffffff',
      border: '2px solid #a78bfa',
      borderRadius: '12px',
      padding: '16px 24px',
      fontSize: '16px',
      fontWeight: '700',
      boxShadow: '0 4px 16px rgba(139, 92, 246, 0.4)',
      minWidth: '200px',
      textAlign: 'center',
    },
  };

  nodes.push(rootNode);

  if (level === 1) {
    // LEVEL 1: Book Level - Complete nested hierarchy (Parts → Chapters → Lessons → ToC)
    // Use recursive rendering to handle arbitrary depth
    const renderNode = (
      item: HierarchyNode,
      parentId: string,
      x: number,
      y: number,
      depth: number
    ): number => {
      const nodeId = item.id || `node-${Math.random()}`;

      // Node style based on depth with proper color contrast
      const getNodeStyle = (depth: number) => {
        switch (depth) {
          case 1: // Parts - Blue gradient background
            return {
              background: '#4f46e5', // Solid indigo for better contrast
              color: '#ffffff',
              border: '2px solid #6366f1',
              fontSize: '14px',
              fontWeight: '600' as const,
              padding: '14px 18px',
              minWidth: '220px',
            };
          case 2: // Chapters - Light blue background
            return {
              background: '#dbeafe',
              color: '#1e3a8a',
              border: '2px solid #93c5fd',
              fontSize: '13px',
              fontWeight: '500' as const,
              padding: '10px 14px',
              minWidth: '180px',
            };
          case 3: // Lessons - Light gray background
            return {
              background: '#f1f5f9',
              color: '#0f172a',
              border: '1px solid #cbd5e1',
              fontSize: '12px',
              fontWeight: '500' as const,
              padding: '8px 12px',
              minWidth: '150px',
            };
          default: // ToC headings - White background
            return {
              background: '#ffffff',
              color: '#1e293b',
              border: '1px solid #e2e8f0',
              fontSize: '11px',
              fontWeight: '400' as const,
              padding: '6px 10px',
              minWidth: '120px',
            };
        }
      };

      const styleProps = getNodeStyle(depth);
      const node: Node = {
        id: nodeId,
        type: 'default',
        data: {
          label: item.label,
          url: item.url,
        },
        position: { x, y },
        style: {
          ...styleProps,
          borderRadius: '8px',
          textAlign: 'center' as const,
          cursor: 'pointer',
          boxShadow: '0 1px 4px rgba(0, 0, 0, 0.08)',
        },
      };

      nodes.push(node);

      // Create edge from parent
      edges.push({
        id: `edge-${parentId}-${nodeId}`,
        source: parentId,
        target: nodeId,
        type: 'smoothstep',
        animated: false,
        style: {
          stroke: depth === 1 ? 'var(--ifm-color-primary, #5a67d8)' : 'var(--ifm-color-emphasis-500, #a0aec0)',
          strokeWidth: depth === 1 ? 2 : 1.5,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: depth === 1 ? 'var(--ifm-color-primary, #5a67d8)' : 'var(--ifm-color-emphasis-500, #a0aec0)',
        },
      });

      // Render children recursively
      let maxY = y;
      if (item.children && item.children.length > 0) {
        const childY = y + 120;
        const horizontalSpacing = Math.max(250, 800 / Math.pow(2, depth)); // Decrease spacing with depth
        const totalWidth = (item.children.length - 1) * horizontalSpacing;
        const startX = x - totalWidth / 2;

        item.children.forEach((child, index) => {
          const childX = startX + index * horizontalSpacing;
          const childMaxY = renderNode(child, nodeId, childX, childY, depth + 1);
          maxY = Math.max(maxY, childMaxY);
        });
      }

      return maxY + 50; // Return max Y for layout calculation
    };

    // Render all parts vertically
    let currentY = 250;
    hierarchy.forEach((part) => {
      currentY = renderNode(part, 'root', 400, currentY, 1);
      currentY += 100; // Spacing between parts
    });
  } else {
    // LEVEL 2 & 3: Flat layout (Chapter Level or Page TOC)
    const horizontalSpacing = 300;
    const verticalSpacing = 150;
    const startX = 150;
    const startY = 250;

    hierarchy.forEach((item, index) => {
      const nodeId = item.id || `node-${index}`;

      // Calculate position in a grid layout
      const column = index % 3;
      const row = Math.floor(index / 3);
      const x = startX + column * horizontalSpacing;
      const y = startY + row * verticalSpacing;

      const node: Node = {
        id: nodeId,
        type: 'default',
        data: {
          label: item.label,
          url: item.url,
        },
        position: { x, y },
        style: {
          background: '#dbeafe',
          color: '#1e3a8a',
          border: '2px solid #93c5fd',
          borderRadius: '8px',
          padding: '12px 16px',
          fontSize: '14px',
          fontWeight: '600',
          minWidth: '180px',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          boxShadow: '0 2px 6px rgba(59, 130, 246, 0.15)',
        },
      };

      nodes.push(node);

      // Create edge from root to this node
      edges.push({
        id: `edge-root-${nodeId}`,
        source: 'root',
        target: nodeId,
        type: 'smoothstep',
        animated: false,
        style: {
          stroke: 'var(--ifm-color-primary, #5a67d8)',
          strokeWidth: 2,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: 'var(--ifm-color-primary, #5a67d8)',
        },
      });
    });
  }

  return { nodes, edges };
}

function getLevelRootLabel(level: number): string {
  if (!ExecutionEnvironment.canUseDOM) {
    return '🗺️ Mindmap';
  }

  switch (level) {
    case 1:
      return '📚 Complete Book Hierarchy';
    case 2: {
      // Dynamic root based on current URL
      const pathname = window.location.pathname;
      const pathParts = pathname.split('/').filter(Boolean);
      if (pathParts.length >= 2 && pathParts[0] === 'docs') {
        const currentRoot = pathParts[pathParts.length - 1];
        // Convert URL slug to readable title (simplified)
        const readable = currentRoot
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        return `📖 ${readable}`;
      }
      return '📖 Current Chapter';
    }
    case 3:
      return '📋 Page Contents';
    default:
      return '🗺️ Mindmap';
  }
}
