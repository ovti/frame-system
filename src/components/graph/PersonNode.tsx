import { Handle, Position, type NodeProps } from '@xyflow/react';

interface PersonNodeData {
  label: string;
  type: string;
}

function PersonNode({ data, selected }: NodeProps) {
  const typedData = data as unknown as PersonNodeData;

  return (
    <div
      className={`min-w-[220px] rounded-2xl border-2 bg-white px-6 py-5 text-center shadow-sm transition ${
        selected ? 'border-slate-900' : 'border-slate-300'
      }`}
    >
      <Handle
        id='top-target'
        type='target'
        position={Position.Top}
        className='!h-3 !w-3 !border-2 !border-white !bg-slate-500'
      />

      <Handle
        id='bottom-source'
        type='source'
        position={Position.Bottom}
        className='!h-3 !w-3 !border-2 !border-white !bg-slate-500'
      />

      <Handle
        id='left-target'
        type='target'
        position={Position.Left}
        className='!h-3 !w-3 !border-2 !border-white !bg-slate-500'
      />

      <Handle
        id='left-source'
        type='source'
        position={Position.Left}
        className='!h-3 !w-3 !border-2 !border-white !bg-slate-500'
        style={{ top: '65%' }}
      />

      <Handle
        id='right-target'
        type='target'
        position={Position.Right}
        className='!h-3 !w-3 !border-2 !border-white !bg-slate-500'
      />

      <Handle
        id='right-source'
        type='source'
        position={Position.Right}
        className='!h-3 !w-3 !border-2 !border-white !bg-slate-500'
        style={{ top: '65%' }}
      />

      <div className='text-3xl font-semibold text-slate-900'>
        {typedData.label}
      </div>

      <div className='mt-2 text-sm text-slate-500'>{typedData.type}</div>
    </div>
  );
}

export default PersonNode;
