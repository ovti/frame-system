import { Handle, Position, type NodeProps } from '@xyflow/react';

interface PersonNodeData {
  label: string;
  type: string;
}

const hiddenHandleClass = '!h-3 !w-3 !border-0 !bg-transparent !opacity-0';

function PersonNode({ data, selected }: NodeProps) {
  const typedData = data as unknown as PersonNodeData;

  return (
    <div
      className={`flex h-[88px] w-[220px] flex-col items-center justify-center rounded-2xl border-2 bg-white text-center shadow-sm transition ${
        selected ? 'border-slate-900' : 'border-slate-300'
      }`}
    >
      <Handle
        id='top-target'
        type='target'
        position={Position.Top}
        className={hiddenHandleClass}
      />

      <Handle
        id='bottom-source'
        type='source'
        position={Position.Bottom}
        className={hiddenHandleClass}
      />

      <Handle
        id='left-source'
        type='source'
        position={Position.Left}
        className={hiddenHandleClass}
        style={{ top: '50%' }}
      />

      <Handle
        id='left-target'
        type='target'
        position={Position.Left}
        className={hiddenHandleClass}
        style={{ top: '50%' }}
      />

      <Handle
        id='right-source'
        type='source'
        position={Position.Right}
        className={hiddenHandleClass}
        style={{ top: '50%' }}
      />

      <Handle
        id='right-target'
        type='target'
        position={Position.Right}
        className={hiddenHandleClass}
        style={{ top: '50%' }}
      />

      <div className='text-xl font-semibold text-slate-900'>
        {typedData.label}
      </div>

      <div className='mt-1 text-xs font-medium uppercase tracking-wide text-slate-500'>
        {typedData.type}
      </div>
    </div>
  );
}

export default PersonNode;
