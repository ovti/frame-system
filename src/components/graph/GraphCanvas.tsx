import dagre from '@dagrejs/dagre';
import {
  Background,
  Controls,
  MarkerType,
  MiniMap,
  Position,
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

function isFamilyEdge(edge: Edge) {
  return getEdgeData(edge).category === 'FAMILY';
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
    nodesep: 130,
    ranksep: 135,
    marginx: 90,
    marginy: 80,
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

  const isHorizontal = direction === 'LR';

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);

    if (!nodeWithPosition) {
      return node;
    }

    return {
      ...node,
      sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
      targetPosition: isHorizontal ? Position.Left : Position.Top,
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

function getFamilyTreeEdge(edge: Edge) {
  return {
    ...edge,
    type: 'smoothstep',
    sourceHandle: getHandleId('bottom', 'source', CENTER_HANDLE_SLOT),
    targetHandle: getHandleId('top', 'target', CENTER_HANDLE_SLOT),
    ...getBaseEdgeStyle(),
  };
}

function getFamilyLateralEdge(edge: Edge, nodes: Node[]) {
  const sourceNode = nodes.find((node) => node.id === edge.source);
  const targetNode = nodes.find((node) => node.id === edge.target);

  if (!sourceNode || !targetNode) {
    return {
      ...edge,
      type: 'straight',
      sourceHandle: getHandleId('right', 'source', CENTER_HANDLE_SLOT),
      targetHandle: getHandleId('left', 'target', CENTER_HANDLE_SLOT),
      ...getLateralEdgeStyle(),
    };
  }

  const isSourceOnLeft = sourceNode.position.x <= targetNode.position.x;

  return {
    ...edge,
    type: 'straight',
    sourceHandle: isSourceOnLeft
      ? getHandleId('right', 'source', CENTER_HANDLE_SLOT)
      : getHandleId('left', 'source', CENTER_HANDLE_SLOT),
    targetHandle: isSourceOnLeft
      ? getHandleId('left', 'target', CENTER_HANDLE_SLOT)
      : getHandleId('right', 'target', CENTER_HANDLE_SLOT),
    ...getLateralEdgeStyle(),
  };
}

function assignGenericEdgeHandles(edges: Edge[], nodes: Node[]) {
  const occupiedSlots = new Map<string, Set<number>>();

  return edges.map((edge) => {
    const layoutRole = getEdgeLayoutRole(edge);

    if (isFamilyEdge(edge)) {
      if (layoutRole === 'LATERAL') {
        return getFamilyLateralEdge(edge, nodes);
      }

      if (layoutRole === 'TREE') {
        return getFamilyTreeEdge(edge);
      }
    }

    const sourceNode = nodes.find((node) => node.id === edge.source);
    const targetNode = nodes.find((node) => node.id === edge.target);

    if (!sourceNode || !targetNode) {
      return {
        ...edge,
        type: 'default',
        sourceHandle: getHandleId('bottom', 'source', CENTER_HANDLE_SLOT),
        targetHandle: getHandleId('top', 'target', CENTER_HANDLE_SLOT),
        ...getBaseEdgeStyle(),
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
      type: layoutRole === 'TREE' ? 'smoothstep' : 'default',
      sourceHandle: getHandleId(sourceSide, 'source', sourceSlot),
      targetHandle: getHandleId(targetSide, 'target', targetSlot),
      ...getBaseEdgeStyle(),
    };
  });
}

function GraphCanvas() {
  const { frames, relations } = useFrameStore();

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

    const layoutedElements = getLayoutedElements(baseNodes, baseEdges, 'TB');

    return {
      nodes: layoutedElements.nodes,
      edges: assignGenericEdgeHandles(
        layoutedElements.edges,
        layoutedElements.nodes,
      ),
    };
  }, [frames, relations]);

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
      <div className='h-[700px] overflow-hidden rounded-2xl border border-slate-200 bg-white'>
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
