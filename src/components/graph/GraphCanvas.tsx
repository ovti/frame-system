import {
  Background,
  Controls,
  MarkerType,
  MiniMap,
  ReactFlow,
  type Edge,
  type Node,
  type NodeMouseHandler,
} from '@xyflow/react';
import { useMemo, useState } from 'react';
import { useFrameStore } from '../../store/frameStore';
import type { Frame } from '../../types/frame';
import FrameDetailsModal from '../frame/FrameDetailsModal';

function GraphCanvas() {
  const { frames, relations } = useFrameStore();
  const [selectedFrame, setSelectedFrame] = useState<Frame | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const nodes: Node[] = useMemo(() => {
    return frames.map((frame, index) => ({
      id: frame.id,
      position: {
        x: 80 + (index % 3) * 260,
        y: 80 + Math.floor(index / 3) * 180,
      },
      data: {
        label: frame.name,
        frameType: frame.type,
      },
      style: {
        borderRadius: 16,
        padding: 12,
        border:
          frame.type === 'CLASS' ? '2px solid #0f172a' : '2px solid #94a3b8',
        background: frame.type === 'CLASS' ? '#e2e8f0' : '#ffffff',
        minWidth: 180,
        fontWeight: 600,
      },
    }));
  }, [frames]);

  const edges: Edge[] = useMemo(() => {
    return relations.map((relation) => ({
      id: relation.id,
      source: relation.sourceId,
      target: relation.targetId,
      label: relation.label,
      animated: relation.type === 'INHERITS_FROM',
      markerEnd: {
        type: MarkerType.ArrowClosed,
      },
    }));
  }, [relations]);

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
