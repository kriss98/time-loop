'use client';

import { useGameStore } from '@/src/game/store/useGameStore';
import { WorkerAction } from '@/src/game/sim/messages';

export const SettingsPanel = ({ dispatch }: { dispatch: (a: WorkerAction) => void }) => {
  const { state } = useGameStore();

  return (
    <section className="game-panel mt-4 p-4">
      <h3 className="panel-title mb-3 text-base">Settings</h3>
      <label className="mb-3 flex items-center justify-between text-sm text-slate-200">
        <span>SFX</span>
        <button
          className={`game-chip ${state.audio.sfxEnabled ? 'active' : ''}`}
          onClick={() =>
            dispatch({
              type: 'SET_AUDIO_SETTINGS',
              payload: { ...state.audio, sfxEnabled: !state.audio.sfxEnabled },
            })
          }
        >
          {state.audio.sfxEnabled ? 'ON' : 'OFF'}
        </button>
      </label>

      <label className="block text-sm text-slate-200">
        Volume: {state.audio.sfxVolume}
        <input
          className="mt-2 w-full accent-cyan-300"
          type="range"
          min={0}
          max={100}
          value={state.audio.sfxVolume}
          onChange={(event) =>
            dispatch({
              type: 'SET_AUDIO_SETTINGS',
              payload: { ...state.audio, sfxVolume: Number(event.target.value) },
            })
          }
        />
      </label>
    </section>
  );
};
