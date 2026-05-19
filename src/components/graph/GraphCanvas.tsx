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
import FrameDetailsModal from '../frame/FrameDetailsModal';
import PersonNode from './PersonNode';

const NODE_WIDTH = 220;
const NODE_HEIGHT = 88;

const CHILD_RELATION_LABELS = [
  'child',
  'son',
  'daughter',
  'dziecko',
  'syn',
  'córka',
];

const SPOUSE_RELATION_LABELS = ['spouse', 'małżonek', 'malzonek'];

const nodeTypes = {
  person: PersonNode,
};

function normalizeLabel(label: unknown) {
  return String(label ?? '')
    .trim()
    .toLowerCase();
}

function isChildRelationLabel(label: unknown) {
  return CHILD_RELATION_LABELS.includes(normalizeLabel(label));
}

function isSpouseRelationLabel(label: unknown) {
  return SPOUSE_RELATION_LABELS.includes(normalizeLabel(label));
}

function isHierarchyEdge(edge: Edge) {
  return isChildRelationLabel(edge.label);
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
    nodesep: 120,
    ranksep: 140,
    marginx: 80,
    marginy: 80,
  });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, {
      width: NODE_WIDTH,
      height: NODE_HEIGHT,
    });
  });

  edges.filter(isHierarchyEdge).forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const isHorizontal = direction === 'LR';

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);

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

function assignEdgeHandles(edges: Edge[], nodes: Node[]) {
  const nodePositionMap = new Map(
    nodes.map((node) => [node.id, node.position]),
  );

  return edges.map((edge) => {
    const isSpouseRelation = isSpouseRelationLabel(edge.label);
    const isChildRelation = isChildRelationLabel(edge.label);

    if (isSpouseRelation) {
      const sourcePosition = nodePositionMap.get(edge.source);
      const targetPosition = nodePositionMap.get(edge.target);

      const isSourceOnLeft =
        sourcePosition && targetPosition
          ? sourcePosition.x <= targetPosition.x
          : true;

      return {
        ...edge,
        type: 'straight',
        sourceHandle: isSourceOnLeft ? 'right-source' : 'left-source',
        targetHandle: isSourceOnLeft ? 'left-target' : 'right-target',
        markerEnd: undefined,
        style: {
          strokeWidth: 2,
        },
      };
    }

    if (isChildRelation) {
      return {
        ...edge,
        type: 'smoothstep',
        sourceHandle: 'bottom-source',
        targetHandle: 'top-target',
        markerEnd: {
          type: MarkerType.ArrowClosed,
        },
        style: {
          strokeWidth: 2,
        },
      };
    }

    return {
      ...edge,
      type: 'smoothstep',
      sourceHandle: 'bottom-source',
      targetHandle: 'top-target',
      style: {
        strokeWidth: 2,
      },
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
    }));

    const layoutedElements = getLayoutedElements(baseNodes, baseEdges, 'TB');

    return {
      nodes: layoutedElements.nodes,
      edges: assignEdgeHandles(layoutedElements.edges, layoutedElements.nodes),
    };
  }, [frames, relations]);

  useEffect(() => {
    setNodes(graphElements.nodes);
    setEdges(graphElements.edges);
  }, [graphElements, setNodes, setEdges]);

  const handleNodesChange = (changes: NodeChange<Node>[]) => {
    setNodes((currentNodes) => {
      const updatedNodes = applyNodeChanges(changes, currentNodes);

      setEdges((currentEdges) => assignEdgeHandles(currentEdges, updatedNodes));

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
