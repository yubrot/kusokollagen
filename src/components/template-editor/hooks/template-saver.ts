import { Template, difference as templateDiff } from '../models/template';
import { useState } from 'react';

export interface TemplateSaver {
  hasDifference: boolean;
  save: (force: boolean) => Promise<void>;
}

// Tracks the last saved template
export function useTemplateSaver(
  source: Template,
  latest: Template,
  onSave?: (diff: Partial<Template>) => Promise<void>
): TemplateSaver {
  const [saved, setSaved] = useState(source);

  const difference = templateDiff(saved, latest);
  const hasDifference = Object.keys(difference).length != 0;

  // NOTE: autosave?

  return {
    hasDifference,
    async save(force) {
      if (!force && !hasDifference) return;
      await onSave?.(difference);
      setSaved(latest);
    },
  };
}
