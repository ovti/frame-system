import { useMemo, useState } from 'react';
import { exportToIEGraphJson } from '../services/ieGraphExporter';
import { useFrameStore } from '../store/frameStore';
import {
  inputClass,
  primaryButtonClass,
  secondaryButtonClass as baseSecondaryButtonClass,
} from '../styles/uiClasses';

const FILE_NAME_MAX_LENGTH = 60;

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

  const fileNameInputId = 'export-file-name';

  const exportResult = useMemo(() => {
    return exportToIEGraphJson(frames, relations);
  }, [frames, relations]);

  const normalizedFileName = sanitizeFileName(fileName) || 'ie-graph-export';

  const secondaryButtonClass = `${baseSecondaryButtonClass} disabled:cursor-not-allowed disabled:opacity-60`;

  const handleFileNameChange = (value: string) => {
    setFileName(value.slice(0, FILE_NAME_MAX_LENGTH));
    setSaveStatus('');
    setSavedFileUrl('');
  };

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
      const response = await fetch('/gragraframe/api/save-export.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName: normalizedFileName,
          content: exportResult.text,
        }),
      });

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
      <div className="mb-6 flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <h2 className="text-2xl font-bold sm:text-3xl">Export</h2>

          <p className="mt-1 text-sm text-slate-500 sm:text-base">
            Export the graph to a textual IE graph representation
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 xl:w-auto xl:flex-row xl:items-end">
          <div className="w-full xl:w-64">
            <label
              htmlFor={fileNameInputId}
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              File name
            </label>

            <input
              id={fileNameInputId}
              name="exportFileName"
              type="text"
              value={fileName}
              onChange={(event) => handleFileNameChange(event.target.value)}
              className={inputClass}
              placeholder="ie-graph-export"
              maxLength={FILE_NAME_MAX_LENGTH}
            />
          </div>

          <button
            type="button"
            onClick={handleDownload}
            className={secondaryButtonClass}
          >
            Download JSON
          </button>

          <button
            type="button"
            onClick={handleSaveToServer}
            disabled={isSaving}
            className={secondaryButtonClass}
          >
            {isSaving ? 'Saving...' : 'Save on server'}
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className={primaryButtonClass}
          >
            {copied ? 'Copied' : 'Copy export'}
          </button>
        </div>
      </div>

      <div className="mb-4 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
        The file will be downloaded as{' '}
        <span className="font-mono font-semibold break-all">
          {normalizedFileName}.json
        </span>
        .
      </div>

      {saveStatus && (
        <div className="mb-4 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
          {saveStatus}

          {savedFileUrl && (
            <>
              {' '}
              File link:{' '}
              <a
                href={savedFileUrl}
                target="_blank"
                rel="noreferrer"
                className="font-mono font-semibold break-all text-slate-900 underline"
              >
                {savedFileUrl}
              </a>
            </>
          )}
        </div>
      )}

      <div className="rounded-2xl bg-white p-3 shadow-sm sm:p-6">
        <textarea
          id="ie-graph-export-output"
          name="ieGraphExportOutput"
          aria-label="IE graph export output"
          readOnly
          value={exportResult.text}
          className="min-h-105 w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-3 font-mono text-xs outline-none sm:min-h-125 sm:px-4 sm:text-sm"
        />
      </div>
    </div>
  );
}

export default ExportPage;
