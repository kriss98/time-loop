'use client';

import { useEffect, useRef } from 'react';
import { PRESTIGE_REQUIREMENT } from '@/src/game/economy/formulas';
import { formatNumber } from '@/src/game/economy/format';
import { useGameStore } from '@/src/game/store/useGameStore';
import { WorkerAction } from '@/src/game/sim/messages';
import { audioManager } from '@/src/game/ui/sfx/audioManager';

export const PrestigePanel = ({ dispatch }: { dispatch: (a: WorkerAction) => void }) => {
  const { state, projectedParadoxGain } = useGameStore();
  const canPrestige = state.totalChrononsEarned >= PRESTIGE_REQUIREMENT;
  const prevParadoxPoints = useRef(state.paradoxPoints);

  useEffect(() => {
    if (state.paradoxPoints > prevParadoxPoints.current) {
      audioManager.playPrestige();
    }
    prevParadoxPoints.current = state.paradoxPoints;
  }, [state.paradoxPoints]);

  return (
    <section className="game-panel mt-3 p-4">
      <h2 className="panel-title">Collapse Timeline</h2>
      <p className="text-sm text-slate-200">
        Requires {formatNumber(PRESTIGE_REQUIREMENT, state.compactNumbers)} lifetime Chronons this run.
      </p>
      <p className="text-sm text-slate-300">
        Progress: {formatNumber(state.totalChrononsEarned, state.compactNumbers)} /{' '}
        {formatNumber(PRESTIGE_REQUIREMENT, state.compactNumbers)}
      </p>
      <p className="text-sm text-fuchsia-200">Projected gain: +{projectedParadoxGain} Paradox Points</p>
      <button
        className="game-button mt-3 bg-fuchsia-700/80 px-3 py-1 text-sm disabled:opacity-50"
        disabled={!canPrestige}
        onClick={() => {
          dispatch({ type: 'PRESTIGE' });
        }}
      >
        Collapse Timeline
      </button>
    </section>
  );
};
