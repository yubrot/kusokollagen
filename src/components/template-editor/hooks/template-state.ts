import CommitLog from '../models/commit-log';
import type { Label } from '../models/label';
import type { Accessibility, Template } from '../models/template';
import { TemplateImage, useTemplateImage } from './template-image';
import { useDeferredEffect } from '../../basics/hooks/defer';
import { useCallback, useEffect, useState } from 'react';

export interface TemplateState {
  current: Template<TemplateImage>;
  staged: Template;

  changeName(name: string): void;
  changeAccessibility(accessibility: Accessibility): void;
  changeLabels(labels: Label[]): void;
  stageImageChange(): Promise<void>;
  commitChanges(): void;

  canUndo: boolean;
  canRedo: boolean;
  undo(): void;
  redo(): void;
}

export function useTemplateState(source: Template): TemplateState {
  // (1) Current state
  const [currentName, setCurrentName] = useState(source.name);
  const [currentAccessibility, setCurrentAccessibility] = useState(source.accessibility);
  const [currentLabels, setCurrentLabels] = useState(source.labels);
  const currentImage = useTemplateImage(source.image);
  const [currentImageSource, setCurrentImageSource] = useState<ImageBitmap | null>(source.image);

  // currentImageSource -> currentImage
  useEffect(() => {
    if (!currentImageSource || !currentImage.ctx) return;
    setCurrentImageSource(null);
    currentImage.resize(currentImageSource.width, currentImageSource.height);
    currentImage.ctx.clearRect(0, 0, currentImageSource.width, currentImageSource.height);
    currentImage.ctx.drawImage(currentImageSource, 0, 0);
  }, [currentImage, currentImageSource]);

  const current = {
    name: currentName,
    accessibility: currentAccessibility,
    labels: currentLabels,
    image: currentImage,
  };

  const setCurrent = useCallback((commit: Template) => {
    setCurrentName(commit.name);
    setCurrentAccessibility(commit.accessibility);
    setCurrentLabels(commit.labels);
    setCurrentImageSource(commit.image);
  }, []);

  // (2) State history
  // `stage` accumulates changes to the (1) Current state
  // `log` holds the committed states for undo and redo operations
  const [{ stage, log }, setHistory] = useState<{
    stage: Partial<Template> | null;
    log: CommitLog<Template>;
  }>(() => ({ stage: null, log: CommitLog.create(source) }));

  const commitChanges = useCallback(() => {
    setHistory(({ stage, log }) => {
      if (stage) log = log.commit({ ...log.current, ...stage });
      return { stage: null, log };
    });
  }, []);

  // name, accessibility, and labels changes are always staged immediately
  const changeName = useCallback((name: string) => {
    setCurrentName(name);
    setHistory(({ stage, log }) => ({ stage: { ...stage, name }, log }));
  }, []);

  const changeAccessibility = useCallback((accessibility: Accessibility) => {
    setCurrentAccessibility(accessibility);
    setHistory(({ stage, log }) => ({ stage: { ...stage, accessibility }, log }));
  }, []);

  const changeLabels = useCallback((labels: Label[]) => {
    setCurrentLabels(labels);
    setHistory(({ stage, log }) => ({ stage: { ...stage, labels }, log }));
  }, []);

  // changes to the current image are staged manually
  const stageImageChange = useCallback(async () => {
    if (!currentImage.ctx) return;
    const image = await createImageBitmap(currentImage.ctx.canvas);
    setHistory(({ stage, log }) => ({ stage: { ...stage, image }, log }));
  }, [currentImage.ctx]);

  // `stage` are automatically committed after 1000ms
  useDeferredEffect(commitChanges, 1000, [stage, commitChanges]);

  const canUndo = log.hasPrev || !!stage;
  const canRedo = log.hasNext;

  const undo = useCallback(() => {
    setHistory(({ stage, log }) => {
      if (stage) log = log.commit({ ...log.current, ...stage });
      log = log.goBack();
      setCurrent(log.current);
      return { stage: null, log };
    });
  }, [setCurrent]);

  const redo = useCallback(() => {
    setHistory(({ log }) => {
      log = log.goForward();
      setCurrent(log.current);
      return { stage: null, log };
    });
  }, [setCurrent]);

  return {
    current,
    staged: { ...log.current, ...stage },

    changeName,
    changeAccessibility,
    changeLabels,
    stageImageChange,
    commitChanges,

    canUndo,
    canRedo,
    undo,
    redo,
  };
}
