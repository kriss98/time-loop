'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { PARADOX_UPGRADES } from '@/src/game/content/paradoxUpgrades';
import { UPGRADES } from '@/src/game/content/upgrades';
import { PRIMARY_CURRENCY_LABEL, formatNumber } from '@/src/game/economy/format';
import { WorkerAction } from '@/src/game/sim/messages';
import { useGameStore } from '@/src/game/store/useGameStore';
import { audioManager } from '@/src/game/ui/sfx/audioManager';

export const UpgradeTabs = ({ dispatch }: { dispatch: (a: WorkerAction) => void }) => {
  const [tab, setTab] = useState<'upgrades' | 'paradox'>('upgrades');
  const { state } = useGameStore();
  const prevUpgradeCount = useRef(state.purchasedUpgrades.length);
  const prevParadoxUpgradeCount = useRef(state.purchasedParadoxUpgrades.length);

  useEffect(() => {
    if (state.purchasedUpgrades.length > prevUpgradeCount.current) {
      audioManager.playBuy();
    }
    prevUpgradeCount.current = state.purchasedUpgrades.length;
  }, [state.purchasedUpgrades.length]);

  useEffect(() => {
    if (state.purchasedParadoxUpgrades.length > prevParadoxUpgradeCount.current) {
      audioManager.playBuy();
    }
    prevParadoxUpgradeCount.current = state.purchasedParadoxUpgrades.length;
  }, [state.purchasedParadoxUpgrades.length]);

  return (
    <section className="game-panel mt-3 p-4">
      <div className="mb-3 flex gap-2">
        <button className={`game-chip ${tab === 'upgrades' ? 'active' : ''}`} onClick={() => setTab('upgrades')}>
          Upgrades
        </button>
        <button className={`game-chip ${tab === 'paradox' ? 'active' : ''}`} onClick={() => setTab('paradox')}>
          Paradox
        </button>
      </div>

      {tab === 'upgrades' && (
        <div className="space-y-2">
          {UPGRADES.map((upgrade) => {
            const purchased = state.purchasedUpgrades.includes(upgrade.id);
            const affordable = state.chronons >= upgrade.cost;
            return (
              <button
                key={upgrade.id}
                className={`store-row w-full text-left ${affordable && !purchased ? 'affordable' : 'locked'}`}
                disabled={purchased}
                onClick={() => {
                  dispatch({ type: 'BUY_UPGRADE', payload: { id: upgrade.id } });
                }}
              >
                <Image src={upgrade.iconPath ?? '/assets/time-loop/upgrade_reinforced_seconds.png'} alt="" width={40} height={40} className="store-icon" />
                <div>
                  <div className="font-semibold">{upgrade.name}</div>
                  <div className="text-xs text-slate-300">{upgrade.description}</div>
                  <div className="text-xs">Cost: {formatNumber(upgrade.cost, state.compactNumbers)} {PRIMARY_CURRENCY_LABEL}</div>
                </div>
              </button>
            );
          })}
        </div>
      )}
      {tab === 'paradox' && (
        <div className="space-y-2">
          {PARADOX_UPGRADES.map((upgrade) => (
            <button
              key={upgrade.id}
              className={`store-row w-full text-left ${
                state.paradoxPoints >= upgrade.cost && !state.purchasedParadoxUpgrades.includes(upgrade.id) ? 'affordable' : 'locked'
              }`}
              disabled={state.purchasedParadoxUpgrades.includes(upgrade.id)}
              onClick={() => {
                dispatch({ type: 'BUY_PARADOX_UPGRADE', payload: { id: upgrade.id } });
              }}
            >
              <Image src="/assets/time-loop/icon_paradox_core.png" alt="" width={40} height={40} className="store-icon" />
              <div>
                <div className="font-semibold">{upgrade.name}</div>
                <div className="text-xs text-slate-300">{upgrade.description}</div>
                <div className="text-xs">Cost: {upgrade.cost} Paradox Points</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </section>
  );
};
