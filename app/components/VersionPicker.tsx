'use client';

import { NEW_VERSION, plural } from '@/lib/client';
import { VERSION_LIMITS, type VersionRow } from '@/lib/types';

/** Dropdown of existing versions plus "＋ Create new version…". */
export function VersionSelect({
  versions,
  value,
  onChange,
  label = 'Version',
}: {
  versions: VersionRow[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
}) {
  return (
    <label className="admin-field">
      <span>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {!value && <option value="">Select a version…</option>}
        {versions.map((v) => (
          <option key={v.id} value={v.id} title={plural(v.response_count, 'response')}>
            {v.name}
          </option>
        ))}
        <option value={NEW_VERSION}>＋ Create new version…</option>
      </select>
    </label>
  );
}

/** Shown under the select while "Create new version…" is chosen. */
export function NewVersionFields({
  name,
  description,
  suggestedName,
  onName,
  onDescription,
}: {
  name: string;
  description: string;
  suggestedName: string;
  onName: (value: string) => void;
  onDescription: (value: string) => void;
}) {
  return (
    <div className="new-version-box">
      <label className="admin-field">
        <span>New version name</span>
        <input
          value={name}
          maxLength={VERSION_LIMITS.name}
          onChange={(e) => onName(e.target.value)}
          placeholder={suggestedName}
        />
      </label>
      <label className="admin-field grow">
        <span>What changed in this version? (optional)</span>
        <input
          value={description}
          maxLength={VERSION_LIMITS.description}
          onChange={(e) => onDescription(e.target.value)}
          placeholder="e.g. New prompt with age-specific vocabulary"
        />
      </label>
    </div>
  );
}
