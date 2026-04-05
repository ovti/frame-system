export interface IEGraphNode {
  id: string;
  label: string;
  category: string;
}

export interface IEGraphEdge {
  id: string;
  from: string;
  to: string;
  relation: string;
}

export interface IEGraph {
  nodes: IEGraphNode[];
  edges: IEGraphEdge[];
}
