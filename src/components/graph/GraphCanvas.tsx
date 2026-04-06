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

function getLayoutedElements(
  nodes: Node[],
  edges: Edge[],
  direction: 'TB' | 'LR' = 'TB',
) {
  const dagreGraph = new dagre.graphlib.Graph();

  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({
    rankdir: direction,
    nodesep: 40,
    ranksep: 80,
    marginx: 20,
    marginy: 20,
  });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, {
      width: NODE_WIDTH,
      height: NODE_HEIGHT,
    });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.target, edge.source);
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
        border:
          frame.type === 'CLASS' ? '2px solid #0f172a' : '2px solid #94a3b8',
        background: frame.type === 'CLASS' ? '#e2e8f0' : '#ffffff',
        fontWeight: 600,
      },
    }));

    const baseEdges: Edge[] = relations.map((relation) => ({
      id: relation.id,
      source: relation.sourceId,
      target: relation.targetId,
      label: relation.label,
      type: 'step',
      animated: relation.type === 'INHERITS_FROM',
      markerEnd: {
        type: MarkerType.ArrowClosed,
      },
    }));

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
