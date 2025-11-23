import { useState, useCallback } from 'react';
import { MindmapData } from '../types';
import { buildHierarchyFromSidebar, hierarchyToGraph } from '../utils/buildGraph';

export function useMindmapGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateMindmap = useCallback(
    async (level: number): Promise<MindmapData> => {
      setIsGenerating(true);

      try {
        // Simulate async operation
        await new Promise((resolve) => setTimeout(resolve, 300));

        // Build hierarchy from sidebar
        const hierarchy = buildHierarchyFromSidebar(level);

        // Convert to graph format
        const { nodes, edges } = hierarchyToGraph(hierarchy, level);

        // Create mindmap data
        const mindmap: MindmapData = {
          id: `mindmap-${Date.now()}`,
          title: getLevelTitle(level),
          level,
          timestamp: new Date().toISOString(),
          nodes,
          edges,
        };

        setIsGenerating(false);
        return mindmap;
      } catch (error) {
        setIsGenerating(false);
        console.error('Error generating mindmap:', error);
        throw error;
      }
    },
    []
  );

  return {
    generateMindmap,
    isGenerating,
  };
}

function getLevelTitle(level: number): string {
  switch (level) {
    case 1:
      return 'Book Level Mindmap';
    case 2:
      return 'Chapter Level Mindmap';
    case 3:
      return 'Lesson Level Mindmap';
    case 4:
      return 'Page TOC Mindmap';
    default:
      return 'Mindmap';
  }
}
