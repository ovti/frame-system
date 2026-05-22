export interface GraphNode {
  id: string;
  label: string;
  type: string;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label: string;
}

export interface GraphNodePosition {
  x: number;
  y: number;
}

export type GraphNodePositions = Record<string, GraphNodePosition>;
