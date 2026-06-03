import { Handle, Position, type NodeProps } from '@xyflow/react';

interface PersonNodeData {
  label: string;
  type: string;
}

const HANDLE_POSITIONS = ['18%', '34%', '50%', '66%', '82%'];

const hiddenHandleClass = '!h-3 !w-3 !border-0 !bg-transparent !opacity-0';

function PersonNode({ data, selected }: NodeProps) {
  const typedData = data as unknown as PersonNodeData;

  return (
    <div
      className={`flex h-17 w-42.5 flex-col items-center justify-center rounded-xl border-2 bg-white text-center shadow-sm transition ${
        selected ? 'border-slate-900' : 'border-slate-300'
      }`}
    >
      {HANDLE_POSITIONS.map((position, index) => (
        <Handle
          key={`top-source-${index}`}
          id={`top-source-${index}`}
          type="source"
          position={Position.Top}
          className={hiddenHandleClass}
          style={{ left: position }}
        />
      ))}

      {HANDLE_POSITIONS.map((position, index) => (
        <Handle
          key={`top-target-${index}`}
          id={`top-target-${index}`}
          type="target"
          position={Position.Top}
          className={hiddenHandleClass}
          style={{ left: position }}
        />
      ))}

      {HANDLE_POSITIONS.map((position, index) => (
        <Handle
          key={`bottom-source-${index}`}
          id={`bottom-source-${index}`}
          type="source"
          position={Position.Bottom}
          className={hiddenHandleClass}
          style={{ left: position }}
        />
      ))}

      {HANDLE_POSITIONS.map((position, index) => (
        <Handle
          key={`bottom-target-${index}`}
          id={`bottom-target-${index}`}
          type="target"
          position={Position.Bottom}
          className={hiddenHandleClass}
          style={{ left: position }}
        />
      ))}

      {HANDLE_POSITIONS.map((position, index) => (
        <Handle
          key={`left-source-${index}`}
          id={`left-source-${index}`}
          type="source"
          position={Position.Left}
          className={hiddenHandleClass}
          style={{ top: position }}
        />
      ))}

      {HANDLE_POSITIONS.map((position, index) => (
        <Handle
          key={`left-target-${index}`}
          id={`left-target-${index}`}
          type="target"
          position={Position.Left}
          className={hiddenHandleClass}
          style={{ top: position }}
        />
      ))}

      {HANDLE_POSITIONS.map((position, index) => (
        <Handle
          key={`right-source-${index}`}
          id={`right-source-${index}`}
          type="source"
          position={Position.Right}
          className={hiddenHandleClass}
          style={{ top: position }}
        />
      ))}

      {HANDLE_POSITIONS.map((position, index) => (
        <Handle
          key={`right-target-${index}`}
          id={`right-target-${index}`}
          type="target"
          position={Position.Right}
          className={hiddenHandleClass}
          style={{ top: position }}
        />
      ))}

      <div className="text-base font-semibold text-slate-900">
        {typedData.label}
      </div>

      <div className="mt-1 text-[10px] font-medium tracking-wide text-slate-500 uppercase">
        {typedData.type}
      </div>
    </div>
  );
}

export default PersonNode;
