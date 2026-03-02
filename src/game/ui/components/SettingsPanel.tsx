'use client';

import { useSyncExternalStore } from 'react';
import { useGameStore } from '@/src/game/store/useGameStore';
import { WorkerAction } from '@/src/game/sim/messages';
import { audioManager } from '@/src/game/ui/sfx/audioManager';

export const SettingsPanel = ({ dispatch }: { dispatch: (a: WorkerAction) => void }) => {
  const { state } = useGameStore();
  const audioUnlocked = useSyncExternalStore(
    (listener) => audioManager.subscribe(listener),
    () => audioManager.isUnlocked(),
    () => true,
  );

  const setAudio = (patch: Partial<typeof state.audio>) => {
    dispatch({
      type: 'SET_AUDIO_SETTINGS',
      payload: { ...state.audio, ...patch },
    });
  };

  return (
    <section className="game-panel mt-4 p-4">
      <h3 className="panel-title mb-3 text-base">Settings</h3>

      <label className="mb-3 flex items-center justify-between text-sm text-slate-200">
        <span>SFX</span>
        <button className={`game-chip ${state.audio.sfxEnabled ? 'active' : ''}`} onClick={() => setAudio({ sfxEnabled: !state.audio.sfxEnabled })}>
          {state.audio.sfxEnabled ? 'ON' : 'OFF'}
        </button>
      </label>

      <label className="mb-4 block text-sm text-slate-200">
        SFX Volume: {Math.round(state.audio.sfxVolume * 100)}%
        <input
          className="mt-2 w-full accent-cyan-300"
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={state.audio.sfxVolume}
          onChange={(event) => setAudio({ sfxVolume: Number(event.target.value) })}
        />
      </label>

      <label className="mb-3 flex items-center justify-between text-sm text-slate-200">
        <span>Music</span>
        <button className={`game-chip ${state.audio.musicEnabled ? 'active' : ''}`} onClick={() => setAudio({ musicEnabled: !state.audio.musicEnabled })}>
          {state.audio.musicEnabled ? 'ON' : 'OFF'}
        </button>
      </label>

      {state.audio.musicEnabled && !audioUnlocked && <p className="mb-2 text-xs text-cyan-200/90">Click anywhere to enable audio.</p>}

      <label className="block text-sm text-slate-200">
        Music Volume: {Math.round(state.audio.musicVolume * 100)}%
        <input
          className="mt-2 w-full accent-cyan-300"
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={state.audio.musicVolume}
          onChange={(event) => setAudio({ musicVolume: Number(event.target.value) })}
        />
      </label>
    </section>
  );
};
