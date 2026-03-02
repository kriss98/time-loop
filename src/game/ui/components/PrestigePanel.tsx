'use client';

import { useGameStore } from '@/src/game/store/useGameStore';
import { WorkerAction } from '@/src/game/sim/messages';

export const PrestigePanel = ({ dispatch }: { dispatch: (a: WorkerAction) => void }) => {
  const { state, projectedParadoxGain } = useGameStore();
  const canPrestige = state.totalHours >= 3;

  return (
    <section className="game-panel mt-3 p-4">
      <h2 className="panel-title">Collapse Timeline</h2>
      <p className="text-sm text-slate-200">Requires total 3 hours. Current total: {state.totalHours.toFixed(2)}</p>
      <p className="text-sm text-fuchsia-200">Projected gain: +{projectedParadoxGain} paradox points</p>
      <button
        className="game-button mt-3 bg-fuchsia-700/80 px-3 py-1 text-sm disabled:opacity-50"
        disabled={!canPrestige}
        onClick={() => dispatch({ type: 'PRESTIGE' })}
      >
        Collapse Timeline
      </button>
    </section>
  );
};
