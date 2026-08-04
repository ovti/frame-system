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
  type OnNodeDrag,
} from '@xyflow/react';
import ELK from 'elkjs/lib/elk.bundled.js';
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

const elk = new ELK();

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

function isTreeEdge(edge: Edge) {
  return getEdgeLayoutRole(edge) === 'TREE';
}

function getDagreLayoutedElements(nodes: Node[], edges: Edge[]) {
  const dagreGraph = new dagre.graphlib.Graph();

  dagreGraph.setDefaultEdgeLabel(() => ({}));

  dagreGraph.setGraph({
    rankdir: 'TB',
    nodesep: 240,
    ranksep: 170,
    marginx: 120,
    marginy: 100,
    ranker: 'network-simplex',
  });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, {
      width: NODE_WIDTH,
      height: NODE_HEIGHT,
    });
  });

  edges.filter(isTreeEdge).forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const layoutedNode = dagreGraph.node(node.id);

    if (!layoutedNode) {
      return node;
    }

    return {
      ...node,
      position: {
        x: layoutedNode.x - NODE_WIDTH / 2,
        y: layoutedNode.y - NODE_HEIGHT / 2,
      },
    };
  });

  return {
    nodes: layoutedNodes,
    edges,
  };
}

async function getElkLayoutedElements(nodes: Node[], edges: Edge[]) {
  const graph = {
    id: 'root',
    layoutOptions: {
      'elk.algorithm': 'layered',
      'elk.direction': 'DOWN',
      'elk.edgeRouting': 'ORTHOGONAL',

      'elk.spacing.nodeNode': '190',
      'elk.spacing.edgeEdge': '60',
      'elk.spacing.edgeNode': '75',
      'elk.layered.spacing.nodeNodeBetweenLayers': '190',
      'elk.layered.spacing.edgeNodeBetweenLayers': '90',
      'elk.layered.spacing.edgeEdgeBetweenLayers': '70',

      'elk.layered.crossingMinimization.strategy': 'LAYER_SWEEP',
      'elk.layered.nodePlacement.strategy': 'NETWORK_SIMPLEX',
      'elk.layered.considerModelOrder.strategy': 'NODES_AND_EDGES',
      'elk.layered.unnecessaryBendpoints': 'true',
      'elk.layered.mergeEdges': 'false',
      'elk.padding': '[top=100,left=150,bottom=100,right=150]',
    },
    children: nodes.map((node) => ({
      id: node.id,
      width: NODE_WIDTH,
      height: NODE_HEIGHT,
    })),
    edges: edges.map((edge) => ({
      id: edge.id,
      sources: [edge.source],
      targets: [edge.target],
    })),
  };

  const layoutedGraph = await elk.layout(graph);

  const positionMap = new Map(
    layoutedGraph.children?.map((node) => [
      node.id,
      {
        x: node.x ?? 0,
        y: node.y ?? 0,
      },
    ]),
  );

  const layoutedNodes = nodes.map((node) => {
    const position = positionMap.get(node.id);

    if (!position) {
      return node;
    }

    return {
      ...node,
      position,
    };
  });

  return {
    nodes: layoutedNodes,
    edges,
  };
}

async function getLayoutedElements(nodes: Node[], edges: Edge[]) {
  if (hasMechanicalGraph(edges)) {
    return getElkLayoutedElements(nodes, edges);
  }

  return getDagreLayoutedElements(nodes, edges);
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

function getEdgeStyle(layoutRole: RelationLayoutRole) {
  return {
    markerEnd:
      layoutRole === 'LATERAL'
        ? undefined
        : {
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

function getEdgeType(layoutRole: RelationLayoutRole) {
  if (layoutRole === 'TREE' || layoutRole === 'LATERAL') {
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
        ...getEdgeStyle(layoutRole),
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
      ...getEdgeStyle(layoutRole),
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

  const baseGraphElements = useMemo(() => {
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

    return {
      nodes: baseNodes,
      edges: baseEdges,
    };
  }, [frames, relations]);

  useEffect(() => {
    let isMounted = true;

    async function layoutGraph() {
      const layoutedElements = await getLayoutedElements(
        baseGraphElements.nodes,
        baseGraphElements.edges,
      );

      const nodesWithSavedPositions = applySavedPositions(
        layoutedElements.nodes,
        nodePositions,
      );

      if (!isMounted) {
        return;
      }

      setNodes(nodesWithSavedPositions);
      setEdges(
        assignGenericEdgeHandles(
          layoutedElements.edges,
          nodesWithSavedPositions,
        ),
      );
    }

    layoutGraph();

    return () => {
      isMounted = false;
    };
  }, [baseGraphElements, nodePositions, setNodes, setEdges]);

  const handleNodesChange = (changes: NodeChange<Node>[]) => {
    setNodes((currentNodes) => {
      const updatedNodes = applyNodeChanges(changes, currentNodes);

      setEdges((currentEdges) =>
        assignGenericEdgeHandles(currentEdges, updatedNodes),
      );

      return updatedNodes;
    });
  };

  const handleNodeDragStop: OnNodeDrag<Node> = () => {
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
      <div className="h-130 min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white sm:h-162.5 lg:h-175">
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
