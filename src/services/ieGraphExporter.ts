import type { Frame } from '../types/frame';
import type { Relation } from '../types/relation';

interface IndexedNode {
  id: string;
  index: number;
  label: string;
}

interface IndexedEdge {
  sourceIndex: number;
  targetIndex: number;
  label: string;
}

interface ExportResult {
  text: string;
  order: IndexedNode[];
  edges: IndexedEdge[];
}

function getNodeLabel(frame: Frame): string {
  return frame.name;
}

function buildAdjacency(frames: Frame[], relations: Relation[]) {
  const adjacency = new Map<string, string[]>();

  frames.forEach((frame) => {
    adjacency.set(frame.id, []);
  });

  relations.forEach((relation) => {
    if (!adjacency.has(relation.sourceId)) {
      adjacency.set(relation.sourceId, []);
    }

    adjacency.get(relation.sourceId)?.push(relation.targetId);
  });

  return adjacency;
}

function getRootFrames(frames: Frame[], relations: Relation[]) {
  const incoming = new Map<string, number>();

  frames.forEach((frame) => {
    incoming.set(frame.id, 0);
  });

  relations.forEach((relation) => {
    incoming.set(relation.targetId, (incoming.get(relation.targetId) ?? 0) + 1);
  });

  return frames
    .filter((frame) => (incoming.get(frame.id) ?? 0) === 0)
    .sort((a, b) => a.name.localeCompare(b.name));
}

function getLottOrder(frames: Frame[], relations: Relation[]): IndexedNode[] {
  const frameMap = new Map(frames.map((frame) => [frame.id, frame]));
  const adjacency = buildAdjacency(frames, relations);
  const roots = getRootFrames(frames, relations);

  const visited = new Set<string>();
  const orderedIds: string[] = [];
  const queue: string[] = roots.map((frame) => frame.id);

  while (queue.length > 0) {
    const currentId = queue.shift();

    if (!currentId || visited.has(currentId)) continue;

    visited.add(currentId);
    orderedIds.push(currentId);

    const neighbors = [...(adjacency.get(currentId) ?? [])].sort((a, b) => {
      const frameA = frameMap.get(a);
      const frameB = frameMap.get(b);

      return (frameA?.name ?? '').localeCompare(frameB?.name ?? '');
    });

    neighbors.forEach((neighborId) => {
      if (!visited.has(neighborId)) {
        queue.push(neighborId);
      }
    });
  }

  const remaining = frames
    .filter((frame) => !visited.has(frame.id))
    .sort((a, b) => a.name.localeCompare(b.name));

  remaining.forEach((frame) => {
    orderedIds.push(frame.id);
  });

  return orderedIds.map((id, index) => {
    const frame = frameMap.get(id);

    return {
      id,
      index: index + 1,
      label: frame ? getNodeLabel(frame) : id,
    };
  });
}

function orientEdgesByIndex(
  relations: Relation[],
  nodeOrder: IndexedNode[],
): IndexedEdge[] {
  const indexMap = new Map(nodeOrder.map((node) => [node.id, node.index]));

  return relations
    .map((relation) => {
      const sourceIndex = indexMap.get(relation.sourceId);
      const targetIndex = indexMap.get(relation.targetId);

      if (!sourceIndex || !targetIndex) return null;

      if (sourceIndex < targetIndex) {
        return {
          sourceIndex,
          targetIndex,
          label: relation.label,
        };
      }

      return {
        sourceIndex: targetIndex,
        targetIndex: sourceIndex,
        label: relation.label,
      };
    })
    .filter((edge): edge is IndexedEdge => edge !== null);
}

export function exportToIEGraphText(
  frames: Frame[],
  relations: Relation[],
): ExportResult {
  const order = getLottOrder(frames, relations);
  const edges = orientEdgesByIndex(relations, order);

  const edgesBySource = new Map<number, IndexedEdge[]>();

  order.forEach((node) => {
    edgesBySource.set(node.index, []);
  });

  edges.forEach((edge) => {
    edgesBySource.get(edge.sourceIndex)?.push(edge);
  });

  order.forEach((node) => {
    const nodeEdges = edgesBySource.get(node.index) ?? [];

    nodeEdges.sort((a, b) => a.targetIndex - b.targetIndex);
  });

  const labelsLine = order.map((node) => node.label).join(' | ');

  const countsLine = order
    .map((node) => String((edgesBySource.get(node.index) ?? []).length))
    .join(' | ');

  const edgeLabelsLine = order
    .map((node) => {
      const nodeEdges = edgesBySource.get(node.index) ?? [];

      return nodeEdges.length > 0
        ? nodeEdges.map((edge) => edge.label).join(' ')
        : '-';
    })
    .join(' | ');

  const targetIndicesLine = order
    .map((node) => {
      const nodeEdges = edgesBySource.get(node.index) ?? [];

      return nodeEdges.length > 0
        ? nodeEdges.map((edge) => String(edge.targetIndex)).join(' ')
        : '-';
    })
    .join(' | ');

  const indexLegend = order
    .map((node) => `${node.index}: ${node.label}`)
    .join('\n');

  const text = [
    '# IE GRAPH EXPORT',
    '',
    '[INDEX -> NODE]',
    indexLegend,
    '',
    '[LABELS]',
    labelsLine,
    '',
    '[EDGE_COUNTS]',
    countsLine,
    '',
    '[EDGE_LABELS]',
    edgeLabelsLine,
    '',
    '[TARGET_INDICES]',
    targetIndicesLine,
  ].join('\n');

  return {
    text,
    order,
    edges,
  };
}
