'use client';

import { exportState, importState, saveState } from '@/src/game/persistence/saveLoad';
import { useGameStore } from '@/src/game/store/useGameStore';
import { WorkerAction } from '@/src/game/sim/messages';

export const TopBar = ({ dispatch }: { dispatch: (a: WorkerAction) => void }) => {
  const { state } = useGameStore();

  return (
    <header className="game-panel mb-4 flex flex-wrap items-center justify-between gap-3 p-4">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-cyan-100">Time Loop Architect</h1>
        <p className="text-sm text-slate-200">Bend causality, optimize cycles, and harvest paradox.</p>
      </div>
      <div className="flex flex-wrap justify-end gap-2 text-sm">
        <button
          className="game-chip"
          onClick={() => dispatch({ type: 'TOGGLE_COMPACT_NUMBERS', payload: { enabled: !state.compactNumbers } })}
        >
          Numbers: {state.compactNumbers ? 'Compact' : 'Full'}
        </button>

        <button
          className="game-chip"
          onClick={() =>
            dispatch({
              type: 'TOGGLE_AUTOCONVERT',
              payload: { currency: 'minutes', enabled: !state.autoConvertSecondsToMinutes },
            })
          }
        >
          Auto s→m: {state.autoConvertSecondsToMinutes ? 'On' : 'Off'}
        </button>
        <button
          className="game-chip"
          onClick={() =>
            dispatch({
              type: 'TOGGLE_AUTOCONVERT',
              payload: { currency: 'hours', enabled: !state.autoConvertMinutesToHours },
            })
          }
        >
          Auto m→h: {state.autoConvertMinutesToHours ? 'On' : 'Off'}
        </button>
        <button className="game-chip" onClick={() => void saveState(state)}>
          Save
        </button>
        <button className="game-chip" onClick={() => navigator.clipboard.writeText(exportState(state))}>
          Export
        </button>
        <button
          className="game-chip"
          onClick={() => {
            const input = window.prompt('Paste save string');
            if (!input) return;
            try {
              const save = importState(input);
              dispatch({ type: 'IMPORT_STATE', payload: { state: save.state } });
            } catch (error) {
              window.alert(error instanceof Error ? error.message : 'Import failed');
            }
          }}
        >
          Import
        </button>
        <button className="game-chip bg-red-800/70" onClick={() => dispatch({ type: 'HARD_RESET' })}>
          Hard Reset
        </button>
      </div>
    </header>
  );
};
