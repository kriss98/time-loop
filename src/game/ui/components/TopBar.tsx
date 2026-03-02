'use client';

import { exportState, importState, saveState } from '@/src/game/persistence/saveLoad';
import { useGameStore } from '@/src/game/store/useGameStore';
import { WorkerAction } from '@/src/game/sim/messages';

export const TopBar = ({ dispatch }: { dispatch: (a: WorkerAction) => void }) => {
  const { state } = useGameStore();

  return (
    <header className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-panel p-4">
      <div>
        <h1 className="text-2xl font-bold text-accent">Time Loop Architect</h1>
        <p className="text-sm text-slate-300">Bend causality, optimize cycles, and harvest paradox.</p>
      </div>
      <div className="flex gap-2 text-sm">
        <button className="rounded bg-slate-700 px-3 py-1" onClick={() => void saveState(state)}>Save</button>
        <button
          className="rounded bg-slate-700 px-3 py-1"
          onClick={() => navigator.clipboard.writeText(exportState(state))}
        >
          Export
        </button>
        <button
          className="rounded bg-slate-700 px-3 py-1"
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
        <button className="rounded bg-red-700 px-3 py-1" onClick={() => dispatch({ type: 'HARD_RESET' })}>
          Hard Reset
        </button>
      </div>
    </header>
  );
};
