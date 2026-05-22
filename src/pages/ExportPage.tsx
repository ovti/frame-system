import { useMemo, useState } from 'react';
import { exportToIEGraphText } from '../services/ieGraphExporter';
import { useFrameStore } from '../store/frameStore';

function sanitizeFileName(fileName: string) {
  return fileName
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9-_]/g, '')
    .toLowerCase();
}

function ExportPage() {
  const { frames, relations } = useFrameStore();
  const [copied, setCopied] = useState(false);
  const [fileName, setFileName] = useState('ie-graph-export');
  const [saveStatus, setSaveStatus] = useState('');
  const [savedFileUrl, setSavedFileUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const exportResult = useMemo(() => {
    return exportToIEGraphText(frames, relations);
  }, [frames, relations]);

  const normalizedFileName = sanitizeFileName(fileName) || 'ie-graph-export';

  const secondaryButtonClass =
    'cursor-pointer rounded-xl border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 shadow-sm transition hover:border-slate-400 hover:bg-slate-100 hover:shadow focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 active:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-white disabled:hover:shadow-sm';

  const primaryButtonClass =
    'cursor-pointer rounded-xl bg-slate-900 px-4 py-2 font-medium text-white shadow-sm transition hover:bg-slate-700 hover:shadow focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 active:bg-slate-950';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(exportResult.text);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy export:', error);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([exportResult.text], {
      type: 'application/json;charset=utf-8',
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = `${normalizedFileName}.json`;
    link.click();

    URL.revokeObjectURL(url);
  };

  const handleSaveToServer = async () => {
    setIsSaving(true);
    setSaveStatus('Saving...');
    setSavedFileUrl('');

    try {
      const response = await fetch(
        '/~21_zalubski/frame-system/api/save-export.php',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fileName: normalizedFileName,
            content: exportResult.text,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to save file.');
      }

      setSaveStatus('Saved on server.');
      setSavedFileUrl(data.fileUrl);
    } catch (error) {
      console.error('Failed to save export:', error);
      setSaveStatus('Failed to save on server.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <div className='mb-6 flex items-start justify-between gap-6'>
        <div>
          <h2 className='text-3xl font-bold'>Export</h2>
          <p className='mt-1 text-slate-500'>
            Export the graph to a textual IE graph representation
          </p>
        </div>

        <div className='flex flex-col gap-3 sm:flex-row sm:items-end'>
          <div>
            <label className='mb-1 block text-sm font-medium text-slate-700'>
              File name
            </label>

            <input
              type='text'
              value={fileName}
              onChange={(event) => setFileName(event.target.value)}
              className='w-64 rounded-xl border border-slate-300 px-4 py-2 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-300'
              placeholder='ie-graph-export'
            />
          </div>

          <button
            type='button'
            onClick={handleDownload}
            className={secondaryButtonClass}
          >
            Download JSON
          </button>

          <button
            type='button'
            onClick={handleSaveToServer}
            disabled={isSaving}
            className={secondaryButtonClass}
          >
            {isSaving ? 'Saving...' : 'Save on server'}
          </button>

          <button
            type='button'
            onClick={handleCopy}
            className={primaryButtonClass}
          >
            {copied ? 'Copied' : 'Copy export'}
          </button>
        </div>
      </div>

      <div className='mb-4 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600'>
        The file will be downloaded as{' '}
        <span className='font-mono font-semibold'>
          {normalizedFileName}.json
        </span>
        .
      </div>

      {saveStatus && (
        <div className='mb-4 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600'>
          {saveStatus}

          {savedFileUrl && (
            <>
              {' '}
              File link:{' '}
              <a
                href={savedFileUrl}
                target='_blank'
                rel='noreferrer'
                className='font-mono font-semibold text-slate-900 underline'
              >
                {savedFileUrl}
              </a>
            </>
          )}
        </div>
      )}

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
