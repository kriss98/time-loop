'use client';

import { GENERATORS } from '@/src/game/content/generators';
import { formatNumber } from '@/src/game/economy/format';
import { getCostCompression, getTotalCost } from '@/src/game/economy/formulas';
import { useGameStore } from '@/src/game/store/useGameStore';
import { BuyAmountMode, WorkerAction } from '@/src/game/sim/messages';

const modes: BuyAmountMode[] = [1, 10, 'max'];

export const GeneratorList = ({ dispatch }: { dispatch: (a: WorkerAction) => void }) => {
  const { state } = useGameStore();

  return (
    <div className="rounded-lg bg-panel p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-bold">Generators</h2>
        <div className="flex gap-2">
          {modes.map((mode) => (
            <button
              key={String(mode)}
              className={`rounded px-2 py-1 text-xs ${state.buyMode === mode ? 'bg-sky-600' : 'bg-slate-700'}`}
              onClick={() => dispatch({ type: 'SET_BUY_MODE', payload: { mode } })}
            >
              Buy {String(mode).toUpperCase()}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        {GENERATORS.map((generator) => {
          const owned = state.generators[generator.id] ?? 0;
          const growth = Math.max(1.05, generator.growth - getCostCompression(state));
          const cost = getTotalCost(generator.baseCost, growth, owned, state.buyMode === 'max' ? 1 : state.buyMode);
          return (
            <div key={generator.id} className="rounded border border-slate-800 p-3">
              <div className="flex justify-between">
                <span>{generator.name}</span>
                <span>Owned: {owned}</span>
              </div>
              <div className="text-sm text-slate-300">+{generator.baseProduction}/s each</div>
              <div className="mt-2 flex items-center justify-between">
                <span>Cost: {formatNumber(cost, state.compactNumbers)}s</span>
                <button
                  className="rounded bg-indigo-600 px-3 py-1"
                  onClick={() =>
                    dispatch({
                      type: 'BUY_GENERATOR',
                      payload: { id: generator.id, amountMode: state.buyMode },
                    })
                  }
                >
                  Buy
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
