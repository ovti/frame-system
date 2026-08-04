import { useMemo, useState } from 'react';
import { relationPresetGroups } from '../data/relationPresets';
import {
  inputClass,
  primaryButtonClass,
  secondaryButtonClass,
} from '../styles/uiClasses';
import type { Frame } from '../types/frame';
import type { Relation, RelationCategory } from '../types/relation';

interface RelationFormProps {
  frames: Frame[];
  onSubmit: (relation: Relation) => void;
  onCancel: () => void;
}

const EDGE_LABEL_MAX_LENGTH = 40;

function RelationForm({ frames, onSubmit, onCancel }: RelationFormProps) {
  const [sourceId, setSourceId] = useState('');
  const [targetId, setTargetId] = useState('');
  const [category, setCategory] = useState<RelationCategory>('FAMILY');
  const [presetId, setPresetId] = useState('spouse');
  const [customLabel, setCustomLabel] = useState('');
  const [error, setError] = useState('');

  const relationSetInputId = 'relation-set';
  const relationTypeInputId = 'relation-type';
  const edgeLabelInputId = 'edge-label';
  const sourceFrameInputId = 'source-frame';
  const targetFrameInputId = 'target-frame';

  const helperTextClass = 'mt-1 text-sm text-slate-500';

  const selectedGroup = useMemo(() => {
    return (
      relationPresetGroups.find((group) => group.id === category) ??
      relationPresetGroups[0]
    );
  }, [category]);

  const selectedPreset = useMemo(() => {
    return (
      selectedGroup.relations.find((relation) => relation.id === presetId) ??
      selectedGroup.relations[0]
    );
  }, [selectedGroup, presetId]);

  const handleCategoryChange = (value: RelationCategory) => {
    const nextGroup =
      relationPresetGroups.find((group) => group.id === value) ??
      relationPresetGroups[0];

    const firstPreset = nextGroup.relations[0];

    setCategory(value);
    setPresetId(firstPreset.id);
    setCustomLabel(firstPreset.defaultLabel ?? '');
    setError('');
  };

  const handlePresetChange = (value: string) => {
    const nextPreset = selectedGroup.relations.find(
      (relation) => relation.id === value,
    );

    setPresetId(value);
    setCustomLabel(nextPreset?.defaultLabel ?? '');
    setError('');
  };

  const handleCustomLabelChange = (value: string) => {
    setCustomLabel(value.slice(0, EDGE_LABEL_MAX_LENGTH));
    setError('');
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (!sourceId || !targetId) {
      setError('Select the source and target frame.');
      return;
    }

    if (sourceId === targetId) {
      setError('A frame cannot be related to itself.');
      return;
    }

    if (!selectedPreset) {
      setError('Select a relation type.');
      return;
    }

    const sourceFrame = frames.find((frame) => frame.id === sourceId);
    const targetFrame = frames.find((frame) => frame.id === targetId);

    if (!sourceFrame || !targetFrame) {
      setError('The selected frames could not be found.');
      return;
    }

    if (
      selectedPreset.type === 'INHERITS_FROM' &&
      (sourceFrame.type !== 'CLASS' || targetFrame.type !== 'CLASS')
    ) {
      setError('The inheritance relation is allowed only between classes.');
      return;
    }

    if (
      selectedPreset.type === 'INSTANCE_OF' &&
      (sourceFrame.type !== 'OBJECT' || targetFrame.type !== 'CLASS')
    ) {
      setError('The instance relation requires the OBJECT → CLASS structure.');
      return;
    }

    const label = selectedPreset.isCustomLabelAllowed
      ? customLabel.trim()
      : selectedPreset.label;

    if (!label) {
      setError('Enter an edge label.');
      return;
    }

    onSubmit({
      id: crypto.randomUUID(),
      sourceId,
      targetId,
      label,
      relationName: selectedPreset.label,
      type: selectedPreset.type,
      category: selectedPreset.category,
      layoutRole: selectedPreset.layoutRole,
    });

    setSourceId('');
    setTargetId('');
    setCategory('FAMILY');
    setPresetId('spouse');
    setCustomLabel('');
    setError('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor={relationSetInputId}
          className="mb-1 block text-sm font-medium text-slate-700"
        >
          Relation set
        </label>

        <select
          id={relationSetInputId}
          name="relationSet"
          value={category}
          onChange={(event) =>
            handleCategoryChange(event.target.value as RelationCategory)
          }
          className={inputClass}
        >
          {relationPresetGroups.map((group) => (
            <option key={group.id} value={group.id}>
              {group.name}
            </option>
          ))}
        </select>

        <p className={helperTextClass}>{selectedGroup.description}</p>
      </div>

      <div>
        <label
          htmlFor={relationTypeInputId}
          className="mb-1 block text-sm font-medium text-slate-700"
        >
          Relation type
        </label>

        <select
          id={relationTypeInputId}
          name="relationType"
          value={presetId}
          onChange={(event) => handlePresetChange(event.target.value)}
          className={inputClass}
        >
          {selectedGroup.relations.map((relation) => (
            <option key={relation.id} value={relation.id}>
              {relation.label}
            </option>
          ))}
        </select>

        <p className={helperTextClass}>{selectedPreset.description}</p>
      </div>

      {selectedPreset.isCustomLabelAllowed && (
        <div>
          <label
            htmlFor={edgeLabelInputId}
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Edge label
          </label>

          <input
            id={edgeLabelInputId}
            name="edgeLabel"
            type="text"
            value={customLabel}
            onChange={(event) => handleCustomLabelChange(event.target.value)}
            className={inputClass}
            placeholder="E.g. 5, 4.5, a.5.6, y"
            maxLength={EDGE_LABEL_MAX_LENGTH}
            required
          />

          <p className={helperTextClass}>
            This value will be used as the actual edge label in the IE graph.
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {customLabel.length}/{EDGE_LABEL_MAX_LENGTH} characters
          </p>
        </div>
      )}

      <div>
        <label
          htmlFor={sourceFrameInputId}
          className="mb-1 block text-sm font-medium text-slate-700"
        >
          Source frame
        </label>

        <select
          id={sourceFrameInputId}
          name="sourceFrame"
          value={sourceId}
          onChange={(event) => {
            setSourceId(event.target.value);
            setError('');
          }}
          className={inputClass}
          required
        >
          <option value="">Select source frame</option>
          {frames.map((frame) => (
            <option key={frame.id} value={frame.id}>
              {frame.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor={targetFrameInputId}
          className="mb-1 block text-sm font-medium text-slate-700"
        >
          Target frame
        </label>

        <select
          id={targetFrameInputId}
          name="targetFrame"
          value={targetId}
          onChange={(event) => {
            setTargetId(event.target.value);
            setError('');
          }}
          className={inputClass}
          required
        >
          <option value="">Select target frame</option>
          {frames.map((frame) => (
            <option key={frame.id} value={frame.id}>
              {frame.name}
            </option>
          ))}
        </select>
      </div>

      <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
        <p className="font-medium text-slate-900">Relation preview</p>

        <p className="mt-1 wrap-break-word">
          {sourceId
            ? frames.find((frame) => frame.id === sourceId)?.name
            : 'Source'}{' '}
          →{' '}
          {selectedPreset.isCustomLabelAllowed
            ? customLabel || 'edge label'
            : selectedPreset.label}{' '}
          →{' '}
          {targetId
            ? frames.find((frame) => frame.id === targetId)?.name
            : 'Target'}
        </p>

        <p className="mt-2 text-xs text-slate-500">
          Relation name: {selectedPreset.label}
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          className={secondaryButtonClass}
        >
          Cancel
        </button>

        <button type="submit" className={primaryButtonClass}>
          Save relation
        </button>
      </div>
    </form>
  );
}

export default RelationForm;
