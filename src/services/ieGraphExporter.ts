import type { Frame } from '../types/frame';
import type { Relation } from '../types/relation';

interface IndexedNode {
  id: string;
  index: number;
  label: string;
}

interface IEGraphNode {
  id: string;
  index: number;
  label: string;
  frameType: Frame['type'];
  attributes: {
    description: string;
    slots: Frame['slots'];
  };
}

interface IEGraphEdge {
  id: string;
  source: number;
  target: number;
  label: string;
  relationName: string;
  relationType: Relation['type'];
  category?: Relation['category'];
  layoutRole?: Relation['layoutRole'];
  original: {
    sourceId: string;
    targetId: string;
    sourceIndex: number;
    targetIndex: number;
    label: string;
    relationName: string;
    type: Relation['type'];
    category?: Relation['category'];
    layoutRole?: Relation['layoutRole'];
    directionPreserved: boolean;
  };
}

interface CharacteristicDescriptionItem {
  index: number;
  nodeId: string;
  label: string;
  outDegree: number;
  edgeLabels: string[];
  edgeRelationNames: string[];
  targetIndices: number[];
}

interface IEGraphJson {
  format: 'IE_GRAPH_JSON';
  version: '1.1';
  graph: {
    V: IEGraphNode[];
    E: IEGraphEdge[];
    Sigma: string[];
    Gamma: string[];
    relationNames: string[];
    phi: Record<string, string>;
  };
  indexing: {
    scheme: 'LOTT_BFS';
    order: IndexedNode[];
  };
  characteristicDescription: CharacteristicDescriptionItem[];
  interpretation: {
    entities: Frame[];
    relations: Relation[];
  };
}

interface ExportResult {
  text: string;
  json: IEGraphJson;
  order: IndexedNode[];
  edges: IEGraphEdge[];
}

function getNodeLabel(frame: Frame): string {
  return frame.name;
}

function getRelationName(relation: Relation): string {
  return relation.relationName ?? relation.label;
}

function getInverseLabel(label: string): string {
  const symmetricLabels = ['małżonek', 'malzonek', 'spouse'];

  if (symmetricLabels.includes(label.toLowerCase())) {
    return label;
  }

  return `${label}^-1`;
}

function getInverseRelationName(relationName: string): string {
  const symmetricRelationNames = ['małżonek', 'malzonek', 'spouse'];

  if (symmetricRelationNames.includes(relationName.toLowerCase())) {
    return relationName;
  }

  return `${relationName}^-1`;
}

function buildUndirectedAdjacency(frames: Frame[], relations: Relation[]) {
  const adjacency = new Map<string, string[]>();

  frames.forEach((frame) => {
    adjacency.set(frame.id, []);
  });

  relations.forEach((relation) => {
    if (!adjacency.has(relation.sourceId)) {
      adjacency.set(relation.sourceId, []);
    }

    if (!adjacency.has(relation.targetId)) {
      adjacency.set(relation.targetId, []);
    }

    adjacency.get(relation.sourceId)?.push(relation.targetId);
    adjacency.get(relation.targetId)?.push(relation.sourceId);
  });

  return adjacency;
}

function getFrameSortValue(frame: Frame): string {
  return `${frame.type}_${frame.name}_${frame.id}`;
}

function getStartFrames(frames: Frame[]) {
  return [...frames].sort((a, b) =>
    getFrameSortValue(a).localeCompare(getFrameSortValue(b)),
  );
}

function getLottOrder(frames: Frame[], relations: Relation[]): IndexedNode[] {
  const frameMap = new Map(frames.map((frame) => [frame.id, frame]));
  const adjacency = buildUndirectedAdjacency(frames, relations);
  const startFrames = getStartFrames(frames);

  const visited = new Set<string>();
  const orderedIds: string[] = [];

  for (const startFrame of startFrames) {
    if (visited.has(startFrame.id)) continue;

    const queue: string[] = [startFrame.id];

    while (queue.length > 0) {
      const currentId = queue.shift();

      if (!currentId || visited.has(currentId)) continue;

      visited.add(currentId);
      orderedIds.push(currentId);

      const neighbors = [...(adjacency.get(currentId) ?? [])]
        .filter((neighborId) => !visited.has(neighborId))
        .sort((a, b) => {
          const frameA = frameMap.get(a);
          const frameB = frameMap.get(b);

          return (frameA?.name ?? a).localeCompare(frameB?.name ?? b);
        });

      neighbors.forEach((neighborId) => {
        if (!visited.has(neighborId) && !queue.includes(neighborId)) {
          queue.push(neighborId);
        }
      });
    }
  }

  return orderedIds.map((id, index) => {
    const frame = frameMap.get(id);

    return {
      id,
      index: index + 1,
      label: frame ? getNodeLabel(frame) : id,
    };
  });
}

function buildIEEdges(
  relations: Relation[],
  nodeOrder: IndexedNode[],
): IEGraphEdge[] {
  const indexMap = new Map(nodeOrder.map((node) => [node.id, node.index]));

  const mappedEdges: Array<IEGraphEdge | null> = relations.map(
    (relation): IEGraphEdge | null => {
      const sourceIndex = indexMap.get(relation.sourceId);
      const targetIndex = indexMap.get(relation.targetId);

      if (!sourceIndex || !targetIndex) return null;

      const directionPreserved = sourceIndex < targetIndex;

      const source = directionPreserved ? sourceIndex : targetIndex;
      const target = directionPreserved ? targetIndex : sourceIndex;

      const relationName = getRelationName(relation);

      const exportedLabel = directionPreserved
        ? relation.label
        : getInverseLabel(relation.label);

      const exportedRelationName = directionPreserved
        ? relationName
        : getInverseRelationName(relationName);

      const original: IEGraphEdge['original'] = {
        sourceId: relation.sourceId,
        targetId: relation.targetId,
        sourceIndex,
        targetIndex,
        label: relation.label,
        relationName,
        type: relation.type,
        directionPreserved,
      };

      if (relation.category) {
        original.category = relation.category;
      }

      if (relation.layoutRole) {
        original.layoutRole = relation.layoutRole;
      }

      const edge: IEGraphEdge = {
        id: relation.id,
        source,
        target,
        label: exportedLabel,
        relationName: exportedRelationName,
        relationType: relation.type,
        original,
      };

      if (relation.category) {
        edge.category = relation.category;
      }

      if (relation.layoutRole) {
        edge.layoutRole = relation.layoutRole;
      }

      return edge;
    },
  );

  return mappedEdges
    .filter((edge): edge is IEGraphEdge => edge !== null)
    .sort((a, b) => {
      if (a.source !== b.source) return a.source - b.source;
      return a.target - b.target;
    });
}

function buildCharacteristicDescription(
  order: IndexedNode[],
  edges: IEGraphEdge[],
): CharacteristicDescriptionItem[] {
  const edgesBySource = new Map<number, IEGraphEdge[]>();

  order.forEach((node) => {
    edgesBySource.set(node.index, []);
  });

  edges.forEach((edge) => {
    edgesBySource.get(edge.source)?.push(edge);
  });

  return order.map((node) => {
    const outgoingEdges = [...(edgesBySource.get(node.index) ?? [])].sort(
      (a, b) => a.target - b.target,
    );

    return {
      index: node.index,
      nodeId: node.id,
      label: node.label,
      outDegree: outgoingEdges.length,
      edgeLabels: outgoingEdges.map((edge) => edge.label),
      edgeRelationNames: outgoingEdges.map((edge) => edge.relationName),
      targetIndices: outgoingEdges.map((edge) => edge.target),
    };
  });
}

function buildSigma(frames: Frame[]) {
  return Array.from(new Set(frames.map((frame) => frame.name))).sort((a, b) =>
    a.localeCompare(b),
  );
}

function buildGamma(edges: IEGraphEdge[]) {
  return Array.from(new Set(edges.map((edge) => edge.label))).sort((a, b) =>
    a.localeCompare(b),
  );
}

function buildRelationNames(edges: IEGraphEdge[]) {
  return Array.from(new Set(edges.map((edge) => edge.relationName))).sort(
    (a, b) => a.localeCompare(b),
  );
}

function buildPhi(order: IndexedNode[]) {
  return order.reduce<Record<string, string>>((result, node) => {
    result[String(node.index)] = node.label;
    return result;
  }, {});
}

function buildIEGraphNodes(
  frames: Frame[],
  order: IndexedNode[],
): IEGraphNode[] {
  const indexMap = new Map(order.map((node) => [node.id, node.index]));

  return frames
    .map((frame) => {
      const index = indexMap.get(frame.id);

      if (!index) return null;

      return {
        id: frame.id,
        index,
        label: frame.name,
        frameType: frame.type,
        attributes: {
          description: frame.description ?? '',
          slots: frame.slots,
        },
      };
    })
    .filter((node): node is IEGraphNode => node !== null)
    .sort((a, b) => a.index - b.index);
}

function buildIEGraphJson(frames: Frame[], relations: Relation[]): IEGraphJson {
  const order = getLottOrder(frames, relations);
  const edges = buildIEEdges(relations, order);
  const V = buildIEGraphNodes(frames, order);

  return {
    format: 'IE_GRAPH_JSON',
    version: '1.1',
    graph: {
      V,
      E: edges,
      Sigma: buildSigma(frames),
      Gamma: buildGamma(edges),
      relationNames: buildRelationNames(edges),
      phi: buildPhi(order),
    },
    indexing: {
      scheme: 'LOTT_BFS',
      order,
    },
    characteristicDescription: buildCharacteristicDescription(order, edges),
    interpretation: {
      entities: frames,
      relations,
    },
  };
}

export function exportToIEGraphJson(
  frames: Frame[],
  relations: Relation[],
): ExportResult {
  const json = buildIEGraphJson(frames, relations);

  return {
    text: JSON.stringify(json, null, 2),
    json,
    order: json.indexing.order,
    edges: json.graph.E,
  };
}

export function exportToIEGraphText(
  frames: Frame[],
  relations: Relation[],
): ExportResult {
  return exportToIEGraphJson(frames, relations);
}
