'use client';

import { PRIMARY_CURRENCY_LABEL, formatNumber } from '@/src/game/economy/format';
import { useGameStore } from '@/src/game/store/useGameStore';

export const CurrencyPanel = () => {
  const { state, chrononsPerSec } = useGameStore();
  return (
    <div className="rounded-lg bg-slate-950/60 p-4">
      <h2 className="mb-3 text-lg font-bold">Currency</h2>
      <div className="flex justify-between py-1">
        <span>{PRIMARY_CURRENCY_LABEL}</span>
        <span>
          {formatNumber(state.chronons, state.compactNumbers)} ({formatNumber(chrononsPerSec, state.compactNumbers)}/s)
        </span>
      </div>
    </div>
  );
};
