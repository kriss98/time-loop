'use client';

import { useGameStore } from '@/src/game/store/useGameStore';
import { WorkerAction } from '@/src/game/sim/messages';

export const PrestigePanel = ({ dispatch }: { dispatch: (a: WorkerAction) => void }) => {
  const { state, projectedParadoxGain } = useGameStore();
  return (
    <div className="rounded-lg bg-panel p-4">
      <h2 className="text-lg font-bold">Collapse Timeline</h2>
      <p className="text-sm text-slate-300">Requires total 3 hours. Current total: {state.totalHours.toFixed(2)}</p>
      <p className="text-sm">Projected gain: +{projectedParadoxGain} paradox points</p>
      <button className="mt-3 rounded bg-fuchsia-700 px-3 py-1" onClick={() => dispatch({ type: 'PRESTIGE' })}>
        Collapse Timeline
      </button>
    </div>
  );
};
