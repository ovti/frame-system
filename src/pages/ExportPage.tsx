import { useMemo, useState } from 'react';
import { exportToIEGraphText } from '../services/ieGraphExporter';
import { useFrameStore } from '../store/frameStore';

function ExportPage() {
  const { frames, relations } = useFrameStore();
  const [copied, setCopied] = useState(false);

  const exportResult = useMemo(() => {
    return exportToIEGraphText(frames, relations);
  }, [frames, relations]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(exportResult.text);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error('Nie udało się skopiować eksportu:', error);
    }
  };

  return (
    <div>
      <div className='mb-6 flex items-center justify-between'>
        <div>
          <h2 className='text-3xl font-bold'>Eksport</h2>
          <p className='mt-1 text-slate-500'>
            Eksport grafu do tekstowej reprezentacji IE graph
          </p>
        </div>

        <button
          onClick={handleCopy}
          className='rounded-xl bg-slate-900 px-4 py-2 text-white transition hover:bg-slate-700'
        >
          {copied ? 'Skopiowano' : 'Kopiuj eksport'}
        </button>
      </div>

      <div className='rounded-2xl bg-white p-6 shadow-sm'>
        <textarea
          readOnly
          value={exportResult.text}
          className='min-h-[500px] w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 font-mono text-sm outline-none'
        />
      </div>
    </div>
  );
}

export default ExportPage;
