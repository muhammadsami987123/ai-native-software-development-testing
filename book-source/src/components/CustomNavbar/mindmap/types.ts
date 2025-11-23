import { Node, Edge } from '@xyflow/react';

export interface MindmapData {
  id: string;
  title: string;
  level: number;
  timestamp: string;
  nodes: Node[];
  edges: Edge[];
}

export interface LevelOption {
  value: number;
  label: string;
  description: string;
}

export interface HierarchyNode {
  id: string;
  label: string;
  level: number;
  children: HierarchyNode[];
  url?: string;
}

export interface BookStructure {
  parts: HierarchyNode[];
  chapters: HierarchyNode[];
  lessons: HierarchyNode[];
  sections: HierarchyNode[];
}
