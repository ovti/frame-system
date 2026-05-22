import dagre from '@dagrejs/dagre';
import {
  Background,
  Controls,
  MarkerType,
  MiniMap,
  ReactFlow,
  applyNodeChanges,
  useEdgesState,
  useNodesState,
  type Edge,
  type Node,
  type NodeChange,
  type NodeMouseHandler,
} from '@xyflow/react';
import { useEffect, useMemo, useState } from 'react';
import { useFrameStore } from '../../store/frameStore';
import type { Frame } from '../../types/frame';
import type { GraphNodePositions } from '../../types/graph';
import type { RelationLayoutRole } from '../../types/relation';
import FrameDetailsModal from '../frame/FrameDetailsModal';
import PersonNode from './PersonNode';

const NODE_WIDTH = 170;
const NODE_HEIGHT = 68;
const HANDLE_SLOTS = 5;
const CENTER_HANDLE_SLOT = 2;

const nodeTypes = {
  person: PersonNode,
};

type HandleSide = 'top' | 'right' | 'bottom' | 'left';

type GraphEdgeData = {
  category?: string;
  relationType?: string;
  layoutRole?: RelationLayoutRole;
};

function getEdgeData(edge: Edge): GraphEdgeData {
  return (edge.data ?? {}) as GraphEdgeData;
}

function getEdgeLayoutRole(edge: Edge): RelationLayoutRole {
  const edgeData = getEdgeData(edge);

  if (edgeData.layoutRole) {
    return edgeData.layoutRole;
  }

  if (
    edgeData.relationType === 'INHERITS_FROM' ||
    edgeData.relationType === 'INSTANCE_OF'
  ) {
    return 'TREE';
  }

  return 'CROSS';
}

function isMechanicalEdge(edge: Edge) {
  return getEdgeData(edge).category === 'MECHANICAL_PART';
}

function hasMechanicalGraph(edges: Edge[]) {
  return edges.some(isMechanicalEdge);
}

function isLayoutEdge(edge: Edge) {
  return getEdgeLayoutRole(edge) === 'TREE';
}

function getLayoutedElements(
  nodes: Node[],
  edges: Edge[],
  direction: 'TB' | 'LR' = 'TB',
) {
  const dagreGraph = new dagre.graphlib.Graph();

  dagreGraph.setDefaultEdgeLabel(() => ({}));

  dagreGraph.setGraph({
    rankdir: direction,
    nodesep: 220,
    ranksep: 180,
    marginx: 140,
    marginy: 110,
  });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, {
      width: NODE_WIDTH,
      height: NODE_HEIGHT,
    });
  });

  edges.filter(isLayoutEdge).forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);

    if (!nodeWithPosition) {
      return node;
    }

    return {
      ...node,
      position: {
        x: nodeWithPosition.x - NODE_WIDTH / 2,
        y: nodeWithPosition.y - NODE_HEIGHT / 2,
      },
    };
  });

  return {
    nodes: layoutedNodes,
    edges,
  };
}

function getMechanicalLayoutedElements(nodes: Node[], edges: Edge[]) {
  const treeEdges = edges.filter((edge) => getEdgeLayoutRole(edge) === 'TREE');
  const nonTreeEdges = edges.filter(
    (edge) => getEdgeLayoutRole(edge) !== 'TREE',
  );

  const nodeIds = new Set(nodes.map((node) => node.id));
  const incomingTreeCount = new Map<string, number>();

  nodes.forEach((node) => {
    incomingTreeCount.set(node.id, 0);
  });

  treeEdges.forEach((edge) => {
    incomingTreeCount.set(
      edge.target,
      (incomingTreeCount.get(edge.target) ?? 0) + 1,
    );
  });

  const roots = nodes.filter(
    (node) => (incomingTreeCount.get(node.id) ?? 0) === 0,
  );

  const mainRoot = roots[0] ?? nodes[0];

  if (!mainRoot) {
    return {
      nodes,
      edges,
    };
  }

  const rootIds = new Set(roots.map((root) => root.id));

  const nonRootNodeIds = nodes
    .map((node) => node.id)
    .filter((nodeId) => !rootIds.has(nodeId));

  const adjacency = new Map<string, Set<string>>();

  nonRootNodeIds.forEach((nodeId) => {
    adjacency.set(nodeId, new Set<string>());
  });

  edges.forEach((edge) => {
    if (!nodeIds.has(edge.source) || !nodeIds.has(edge.target)) {
      return;
    }

    if (rootIds.has(edge.source) || rootIds.has(edge.target)) {
      return;
    }

    adjacency.get(edge.source)?.add(edge.target);
    adjacency.get(edge.target)?.add(edge.source);
  });

  const visited = new Set<string>();
  const components: string[][] = [];

  nonRootNodeIds.forEach((nodeId) => {
    if (visited.has(nodeId)) {
      return;
    }

    const component: string[] = [];
    const queue = [nodeId];

    visited.add(nodeId);

    while (queue.length > 0) {
      const currentId = queue.shift();

      if (!currentId) {
        continue;
      }

      component.push(currentId);

      adjacency.get(currentId)?.forEach((neighborId) => {
        if (!visited.has(neighborId)) {
          visited.add(neighborId);
          queue.push(neighborId);
        }
      });
    }

    components.push(component);
  });

  const outgoingScore = new Map<string, number>();

  nodes.forEach((node) => {
    outgoingScore.set(node.id, 0);
  });

  nonTreeEdges.forEach((edge) => {
    outgoingScore.set(edge.source, (outgoingScore.get(edge.source) ?? 0) + 2);
    outgoingScore.set(edge.target, (outgoingScore.get(edge.target) ?? 0) + 1);
  });

  treeEdges.forEach((edge) => {
    outgoingScore.set(edge.source, (outgoingScore.get(edge.source) ?? 0) + 1);
  });

  components.sort((a, b) => {
    const aScore = a.reduce(
      (sum, nodeId) => sum + (outgoingScore.get(nodeId) ?? 0),
      0,
    );

    const bScore = b.reduce(
      (sum, nodeId) => sum + (outgoingScore.get(nodeId) ?? 0),
      0,
    );

    if (aScore !== bScore) {
      return bScore - aScore;
    }

    return a[0].localeCompare(b[0]);
  });

  const nodeMap = new Map(nodes.map((node) => [node.id, node]));

  const rootY = 90;
  const rootX = 720;
  const componentGap = 520;
  const componentTopY = 330;
  const componentBottomY = 560;
  const itemGap = 340;

  const totalWidth = Math.max(0, (components.length - 1) * componentGap);
  const startX = rootX - totalWidth / 2;

  const positionedNodes = nodes.map((node) => {
    if (node.id === mainRoot.id) {
      return {
        ...node,
        position: {
          x: rootX - NODE_WIDTH / 2,
          y: rootY,
        },
      };
    }

    return node;
  });

  const positionedMap = new Map(positionedNodes.map((node) => [node.id, node]));

  roots
    .filter((root) => root.id !== mainRoot.id)
    .forEach((root, index) => {
      const x = rootX + (index + 1) * componentGap;

      positionedMap.set(root.id, {
        ...root,
        position: {
          x,
          y: rootY,
        },
      });
    });

  components.forEach((component, componentIndex) => {
    const componentCenterX = startX + componentIndex * componentGap;

    const sortedComponent = [...component].sort((a, b) => {
      const aScore = outgoingScore.get(a) ?? 0;
      const bScore = outgoingScore.get(b) ?? 0;

      if (aScore !== bScore) {
        return bScore - aScore;
      }

      const nodeA = nodeMap.get(a);
      const nodeB = nodeMap.get(b);

      return String(nodeA?.data.label ?? a).localeCompare(
        String(nodeB?.data.label ?? b),
      );
    });

    const centralNodeId = sortedComponent[0];
    const restNodeIds = sortedComponent.slice(1);

    const centralNode = nodeMap.get(centralNodeId);

    if (centralNode) {
      positionedMap.set(centralNodeId, {
        ...centralNode,
        position: {
          x: componentCenterX - NODE_WIDTH / 2,
          y: componentTopY,
        },
      });
    }

    const rowWidth = Math.max(0, (restNodeIds.length - 1) * itemGap);
    const rowStartX = componentCenterX - rowWidth / 2;

    restNodeIds.forEach((nodeId, index) => {
      const node = nodeMap.get(nodeId);

      if (!node) {
        return;
      }

      positionedMap.set(nodeId, {
        ...node,
        position: {
          x: rowStartX + index * itemGap - NODE_WIDTH / 2,
          y: componentBottomY,
        },
      });
    });
  });

  return {
    nodes: nodes.map((node) => positionedMap.get(node.id) ?? node),
    edges,
  };
}

function applySavedPositions(
  nodes: Node[],
  nodePositions: GraphNodePositions,
): Node[] {
  return nodes.map((node) => {
    const savedPosition = nodePositions[node.id];

    if (!savedPosition) {
      return node;
    }

    return {
      ...node,
      position: savedPosition,
    };
  });
}

function getNodeCenter(node: Node) {
  return {
    x: node.position.x + NODE_WIDTH / 2,
    y: node.position.y + NODE_HEIGHT / 2,
  };
}

function getEdgeSides(edge: Edge, nodes: Node[]) {
  const sourceNode = nodes.find((node) => node.id === edge.source);
  const targetNode = nodes.find((node) => node.id === edge.target);

  if (!sourceNode || !targetNode) {
    return {
      sourceSide: 'bottom' as HandleSide,
      targetSide: 'top' as HandleSide,
    };
  }

  const sourceCenter = getNodeCenter(sourceNode);
  const targetCenter = getNodeCenter(targetNode);

  const dx = targetCenter.x - sourceCenter.x;
  const dy = targetCenter.y - sourceCenter.y;

  if (Math.abs(dx) >= Math.abs(dy)) {
    return dx >= 0
      ? {
          sourceSide: 'right' as HandleSide,
          targetSide: 'left' as HandleSide,
        }
      : {
          sourceSide: 'left' as HandleSide,
          targetSide: 'right' as HandleSide,
        };
  }

  return dy >= 0
    ? {
        sourceSide: 'bottom' as HandleSide,
        targetSide: 'top' as HandleSide,
      }
    : {
        sourceSide: 'top' as HandleSide,
        targetSide: 'bottom' as HandleSide,
      };
}

function clampSlot(slot: number) {
  return Math.max(0, Math.min(HANDLE_SLOTS - 1, slot));
}

function getPreferredSlot(node: Node, otherNode: Node, side: HandleSide) {
  const otherCenter = getNodeCenter(otherNode);

  if (side === 'left' || side === 'right') {
    const relativeY = (otherCenter.y - node.position.y) / NODE_HEIGHT;

    return clampSlot(Math.round(relativeY * (HANDLE_SLOTS - 1)));
  }

  const relativeX = (otherCenter.x - node.position.x) / NODE_WIDTH;

  return clampSlot(Math.round(relativeX * (HANDLE_SLOTS - 1)));
}

function getAvailableSlot(
  occupiedSlots: Map<string, Set<number>>,
  nodeId: string,
  side: HandleSide,
  preferredSlot: number,
) {
  const key = `${nodeId}-${side}`;
  const occupied = occupiedSlots.get(key) ?? new Set<number>();

  if (!occupied.has(preferredSlot)) {
    occupied.add(preferredSlot);
    occupiedSlots.set(key, occupied);

    return preferredSlot;
  }

  for (let distance = 1; distance < HANDLE_SLOTS; distance += 1) {
    const lowerSlot = preferredSlot - distance;
    const upperSlot = preferredSlot + distance;

    if (lowerSlot >= 0 && !occupied.has(lowerSlot)) {
      occupied.add(lowerSlot);
      occupiedSlots.set(key, occupied);

      return lowerSlot;
    }

    if (upperSlot < HANDLE_SLOTS && !occupied.has(upperSlot)) {
      occupied.add(upperSlot);
      occupiedSlots.set(key, occupied);

      return upperSlot;
    }
  }

  return preferredSlot;
}

function getHandleId(
  side: HandleSide,
  type: 'source' | 'target',
  slotIndex: number,
) {
  return `${side}-${type}-${slotIndex}`;
}

function getBaseEdgeStyle() {
  return {
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 15,
      height: 15,
    },
    style: {
      strokeWidth: 1.8,
      stroke: '#9ca3af',
    },
    labelStyle: {
      fontSize: 16,
      fontWeight: 700,
      fill: '#0f172a',
    },
    labelBgStyle: {
      fill: '#ffffff',
      fillOpacity: 0.95,
    },
    labelBgPadding: [8, 5] as [number, number],
    labelBgBorderRadius: 6,
  };
}

function getLateralEdgeStyle() {
  return {
    markerEnd: undefined,
    style: {
      strokeWidth: 1.8,
      stroke: '#9ca3af',
    },
    labelStyle: {
      fontSize: 16,
      fontWeight: 700,
      fill: '#0f172a',
    },
    labelBgStyle: {
      fill: '#ffffff',
      fillOpacity: 0.95,
    },
    labelBgPadding: [8, 5] as [number, number],
    labelBgBorderRadius: 6,
  };
}

function getEdgeType(layoutRole: RelationLayoutRole) {
  if (layoutRole === 'TREE') {
    return 'smoothstep';
  }

  if (layoutRole === 'LATERAL') {
    return 'smoothstep';
  }

  return 'default';
}

function assignGenericEdgeHandles(edges: Edge[], nodes: Node[]) {
  const occupiedSlots = new Map<string, Set<number>>();

  return edges.map((edge) => {
    const layoutRole = getEdgeLayoutRole(edge);
    const sourceNode = nodes.find((node) => node.id === edge.source);
    const targetNode = nodes.find((node) => node.id === edge.target);

    if (!sourceNode || !targetNode) {
      return {
        ...edge,
        type: getEdgeType(layoutRole),
        sourceHandle: getHandleId('bottom', 'source', CENTER_HANDLE_SLOT),
        targetHandle: getHandleId('top', 'target', CENTER_HANDLE_SLOT),
        ...(layoutRole === 'LATERAL'
          ? getLateralEdgeStyle()
          : getBaseEdgeStyle()),
      };
    }

    const { sourceSide, targetSide } = getEdgeSides(edge, nodes);

    const preferredSourceSlot = getPreferredSlot(
      sourceNode,
      targetNode,
      sourceSide,
    );

    const preferredTargetSlot = getPreferredSlot(
      targetNode,
      sourceNode,
      targetSide,
    );

    const sourceSlot = getAvailableSlot(
      occupiedSlots,
      edge.source,
      sourceSide,
      preferredSourceSlot,
    );

    const targetSlot = getAvailableSlot(
      occupiedSlots,
      edge.target,
      targetSide,
      preferredTargetSlot,
    );

    return {
      ...edge,
      type: getEdgeType(layoutRole),
      sourceHandle: getHandleId(sourceSide, 'source', sourceSlot),
      targetHandle: getHandleId(targetSide, 'target', targetSlot),
      ...(layoutRole === 'LATERAL'
        ? getLateralEdgeStyle()
        : getBaseEdgeStyle()),
    };
  });
}

function getPositionsFromNodes(nodesToSave: Node[]): GraphNodePositions {
  return nodesToSave.reduce<GraphNodePositions>((positions, node) => {
    positions[node.id] = {
      x: node.position.x,
      y: node.position.y,
    };

    return positions;
  }, {});
}

function GraphCanvas() {
  const { frames, relations, nodePositions, setNodePositions } =
    useFrameStore();

  const [selectedFrame, setSelectedFrame] = useState<Frame | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const [nodes, setNodes] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const graphElements = useMemo(() => {
    const baseNodes: Node[] = frames.map((frame) => ({
      id: frame.id,
      type: 'person',
      data: {
        label: frame.name,
        type: frame.type,
      },
      position: { x: 0, y: 0 },
    }));

    const baseEdges: Edge[] = relations.map((relation) => ({
      id: relation.id,
      source: relation.sourceId,
      target: relation.targetId,
      label: relation.label,
      animated: false,
      data: {
        category: relation.category,
        relationType: relation.type,
        layoutRole: relation.layoutRole,
      },
    }));

    const layoutedElements = hasMechanicalGraph(baseEdges)
      ? getMechanicalLayoutedElements(baseNodes, baseEdges)
      : getLayoutedElements(baseNodes, baseEdges, 'TB');

    const nodesWithSavedPositions = applySavedPositions(
      layoutedElements.nodes,
      nodePositions,
    );

    return {
      nodes: nodesWithSavedPositions,
      edges: assignGenericEdgeHandles(
        layoutedElements.edges,
        nodesWithSavedPositions,
      ),
    };
  }, [frames, relations, nodePositions]);

  useEffect(() => {
    setNodes(graphElements.nodes);
    setEdges(graphElements.edges);
  }, [graphElements, setNodes, setEdges]);

  const handleNodesChange = (changes: NodeChange<Node>[]) => {
    setNodes((currentNodes) => {
      const updatedNodes = applyNodeChanges(changes, currentNodes);

      setEdges((currentEdges) =>
        assignGenericEdgeHandles(currentEdges, updatedNodes),
      );

      return updatedNodes;
    });
  };

  const handleNodeDragStop: NodeMouseHandler = () => {
    setNodePositions(getPositionsFromNodes(nodes));
  };

  const handleNodeClick: NodeMouseHandler = (_, node) => {
    const frame = frames.find((item) => item.id === node.id) ?? null;

    setSelectedFrame(frame);
    setIsDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setSelectedFrame(null);
    setIsDetailsOpen(false);
  };

  return (
    <>
      <div className='h-[520px] min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white sm:h-[650px] lg:h-[700px]'>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
          nodesDraggable
          nodesConnectable={false}
          elementsSelectable
          onNodesChange={handleNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeDragStop={handleNodeDragStop}
          onNodeClick={handleNodeClick}
        >
          <Background />
          <MiniMap />
          <Controls />
        </ReactFlow>
      </div>

      <FrameDetailsModal
        frame={selectedFrame}
        isOpen={isDetailsOpen}
        onClose={handleCloseDetails}
      />
    </>
  );
}

export default GraphCanvas;
