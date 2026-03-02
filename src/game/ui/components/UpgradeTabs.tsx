'use client';

import { useState } from 'react';
import { PARADOX_UPGRADES } from '@/src/game/content/paradoxUpgrades';
import { UPGRADES } from '@/src/game/content/upgrades';
import { WorkerAction } from '@/src/game/sim/messages';
import { useGameStore } from '@/src/game/store/useGameStore';

export const UpgradeTabs = ({ dispatch }: { dispatch: (a: WorkerAction) => void }) => {
  const [tab, setTab] = useState<'upgrades' | 'paradox'>('upgrades');
  const { state } = useGameStore();

  return (
    <div className="rounded-lg bg-panel p-4">
      <div className="mb-3 flex gap-2">
        <button className={`rounded px-3 py-1 ${tab === 'upgrades' ? 'bg-sky-600' : 'bg-slate-700'}`} onClick={() => setTab('upgrades')}>Upgrades</button>
        <button className={`rounded px-3 py-1 ${tab === 'paradox' ? 'bg-sky-600' : 'bg-slate-700'}`} onClick={() => setTab('paradox')}>Paradox Shop</button>
      </div>

      {tab === 'upgrades' && (
        <div className="space-y-2">
          {UPGRADES.map((upgrade) => (
            <button
              key={upgrade.id}
              className="w-full rounded border border-slate-800 p-2 text-left"
              disabled={state.purchasedUpgrades.includes(upgrade.id)}
              onClick={() => dispatch({ type: 'BUY_UPGRADE', payload: { id: upgrade.id } })}
            >
              <div className="font-semibold">{upgrade.name}</div>
              <div className="text-xs text-slate-300">{upgrade.description}</div>
              <div className="text-xs">Cost: {upgrade.cost} {upgrade.currency}</div>
            </button>
          ))}
        </div>
      )}
      {tab === 'paradox' && (
        <div className="space-y-2">
          {PARADOX_UPGRADES.map((upgrade) => (
            <button
              key={upgrade.id}
              className="w-full rounded border border-slate-800 p-2 text-left"
              disabled={state.purchasedParadoxUpgrades.includes(upgrade.id)}
              onClick={() => dispatch({ type: 'BUY_PARADOX_UPGRADE', payload: { id: upgrade.id } })}
            >
              <div className="font-semibold">{upgrade.name}</div>
              <div className="text-xs text-slate-300">{upgrade.description}</div>
              <div className="text-xs">Cost: {upgrade.cost} paradox points</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
