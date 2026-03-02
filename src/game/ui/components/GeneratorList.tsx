'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { GENERATORS } from '@/src/game/content/generators';
import { PRIMARY_CURRENCY_LABEL, formatNumber } from '@/src/game/economy/format';
import { getCostCompression, getTotalCost } from '@/src/game/economy/formulas';
import { useGameStore } from '@/src/game/store/useGameStore';
import { BuyAmountMode, WorkerAction } from '@/src/game/sim/messages';
import { audioManager } from '@/src/game/ui/sfx/audioManager';

const modes: BuyAmountMode[] = [1, 10, 'max'];

export const GeneratorList = ({ dispatch }: { dispatch: (a: WorkerAction) => void }) => {
  const { state } = useGameStore();
  const [poppedId, setPoppedId] = useState<string | null>(null);
  const prevOwned = useRef<Record<string, number>>(state.generators);

  useEffect(() => {
    for (const generator of GENERATORS) {
      if ((state.generators[generator.id] ?? 0) > (prevOwned.current[generator.id] ?? 0)) {
        setPoppedId(generator.id);
        audioManager.playBuy();
        window.setTimeout(() => setPoppedId((current) => (current === generator.id ? null : current)), 200);
      }
    }
    prevOwned.current = state.generators;
  }, [state.generators]);

  return (
    <section className="game-panel p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="panel-title">Generators</h2>
        <div className="flex gap-2">
          {modes.map((mode) => (
            <button
              key={String(mode)}
              className={`game-chip ${state.buyMode === mode ? 'active' : ''}`}
              onClick={() => dispatch({ type: 'SET_BUY_MODE', payload: { mode } })}
            >
              {String(mode).toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {GENERATORS.map((generator) => {
          const owned = state.generators[generator.id] ?? 0;
          const growth = Math.max(1.05, generator.growth - getCostCompression(state));
          const cost = getTotalCost(generator.baseCost, growth, owned, state.buyMode === 'max' ? 1 : state.buyMode);
          const affordable = state.chronons >= cost;

          return (
            <button
              key={generator.id}
              className={`store-row w-full text-left ${affordable ? 'affordable' : 'locked'} ${poppedId === generator.id ? 'popped' : ''}`}
              onClick={() => dispatch({ type: 'BUY_GENERATOR', payload: { id: generator.id, amountMode: state.buyMode } })}
            >
              <Image src={generator.iconPath ?? '/assets/time-loop/icon_chrono_shard.png'} alt="" width={40} height={40} className="store-icon" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate font-semibold">{generator.name}</span>
                  <span className="text-xs text-slate-300">Owned: {owned}</span>
                </div>
                <div className="text-xs text-slate-300">+{generator.baseProduction}/sec each</div>
                <div className="text-xs text-cyan-100">Cost: {formatNumber(cost, state.compactNumbers)} {PRIMARY_CURRENCY_LABEL}</div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
