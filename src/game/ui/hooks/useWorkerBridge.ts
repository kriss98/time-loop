'use client';

import { useEffect, useRef } from 'react';
import { loadState, saveState } from '@/src/game/persistence/saveLoad';
import { useGameStore } from '@/src/game/store/useGameStore';
import { WorkerAction, WorkerOutboundMessage } from '@/src/game/sim/messages';
import { soundManager } from '@/src/game/ui/sfx/sound';

export const useWorkerBridge = () => {
  const workerRef = useRef<Worker | null>(null);
  const setSnapshot = useGameStore((s) => s.setSnapshot);
  const state = useGameStore((s) => s.state);

  useEffect(() => {
    const worker = new Worker(new URL('@/src/game/sim/worker.ts', import.meta.url), { type: 'module' });
    workerRef.current = worker;

    worker.onmessage = (event: MessageEvent<WorkerOutboundMessage>) => {
      if (event.data.type === 'SNAPSHOT') {
        setSnapshot(event.data.payload);
      }
    };

    loadState().then((save) => {
      if (save) {
        worker.postMessage({ type: 'IMPORT_STATE', payload: { state: save.state } } satisfies WorkerAction);
      }
      worker.postMessage({ type: 'REQUEST_SNAPSHOT' } satisfies WorkerAction);
    });

    return () => worker.terminate();
  }, [setSnapshot]);

  useEffect(() => {
    soundManager.configure(state.audio.sfxEnabled, state.audio.sfxVolume);
  }, [state.audio.sfxEnabled, state.audio.sfxVolume]);

  useEffect(() => {
    const timer = setInterval(() => {
      void saveState({ ...state, lastSavedAt: Date.now() });
    }, 10_000);
    return () => clearInterval(timer);
  }, [state]);

  const dispatch = (action: WorkerAction) => workerRef.current?.postMessage(action);

  return { dispatch };
};
