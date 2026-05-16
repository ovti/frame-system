import dagre from '@dagrejs/dagre';
import {
  Background,
  Controls,
  MarkerType,
  MiniMap,
  Position,
  ReactFlow,
  type Edge,
  type Node,
  type NodeMouseHandler,
} from '@xyflow/react';
import { useMemo, useState } from 'react';
import { useFrameStore } from '../../store/frameStore';
import type { Frame } from '../../types/frame';
import FrameDetailsModal from '../frame/FrameDetailsModal';

const NODE_WIDTH = 220;
const NODE_HEIGHT = 80;

const CHILD_RELATION_LABELS = [
  'child',
  'son',
  'daughter',
  'dziecko',
  'syn',
  'córka',
];
const SPOUSE_RELATION_LABELS = ['spouse', 'małżonek', 'malzonek'];

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

  return { nodes: layoutedNodes, edges };
}

function GraphCanvas() {
  const { frames, relations } = useFrameStore();
  const [selectedFrame, setSelectedFrame] = useState<Frame | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const { nodes, edges } = useMemo(() => {
    const baseNodes: Node[] = frames.map((frame) => ({
      id: frame.id,
      data: {
        label: frame.name,
      },
      position: { x: 0, y: 0 },
      style: {
        width: NODE_WIDTH,
        borderRadius: 16,
        padding: 12,
        border: '2px solid #94a3b8',
        background: '#ffffff',
        fontWeight: 600,
      },
    }));

    const baseEdges: Edge[] = relations.map((relation) => {
      const isSpouseRelation = isSpouseRelationLabel(relation.label);
      const isChildRelation = isChildRelationLabel(relation.label);

      return {
        id: relation.id,
        source: relation.sourceId,
        target: relation.targetId,
        label: relation.label,
        type: isSpouseRelation ? 'straight' : 'smoothstep',
        animated: false,
        markerEnd: isChildRelation
          ? {
              type: MarkerType.ArrowClosed,
            }
          : undefined,
        style: {
          strokeWidth: 2,
        },
      };
    });

    return getLayoutedElements(baseNodes, baseEdges, 'TB');
  }, [frames, relations]);

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
          fitView
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable
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
