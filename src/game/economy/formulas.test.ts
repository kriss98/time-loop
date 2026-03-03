import { describe, expect, it } from 'vitest';

import {
  PRESTIGE_REQUIREMENT_BASELINE,
  calculateAffordableAmount,
  getChrononsPerSecond,
  getProjectedParadoxGain,
  getTotalCost,
  getVisibleUpgrades,
  isUpgradeUnlocked,
} from './formulas';
import { UPGRADES } from '../content/upgrades';
import { createInitialState } from '../sim/reducer';

describe('economy formulas', () => {
  it('computes geometric purchase cost', () => {
    const total = getTotalCost(10, 1.15, 0, 3);
    expect(total).toBeCloseTo(34.725);
  });

  it('finds max affordable amount', () => {
    const amount = calculateAffordableAmount(1000, 15, 1.15, 0);
    expect(amount).toBeGreaterThan(10);
  });

  it('applies tier and synergy production multipliers', () => {
    const state = createInitialState();
    state.generators.chronoShard = 25;
    state.generators.timeAnchor = 25;
    state.purchasedUpgrades.push('chronoShard-tier-1');
    state.purchasedUpgrades.push('synergy-anchor-shard');

    const rate = getChrononsPerSecond(state);
    expect(rate).toBeGreaterThan(12);
  });

  it('checks unlock requirements correctly', () => {
    const state = createInitialState();
    const tierUpgrade = UPGRADES.find((u) => u.id === 'chronoShard-tier-1');
    expect(tierUpgrade).toBeDefined();
    if (!tierUpgrade) throw new Error('Expected upgrade definition');

    expect(isUpgradeUnlocked(state, tierUpgrade)).toBe(false);
    state.generators.chronoShard = 10;
    expect(isUpgradeUnlocked(state, tierUpgrade)).toBe(true);
  });

  it('selects only affordable upgrades when affordable exists', () => {
    const state = createInitialState();
    state.totalChrononsEarned = 1_000_000;
    state.generators.chronoShard = 60;
    state.chronons = 2_000;

    const visible = getVisibleUpgrades(state, UPGRADES);
    expect(visible.length).toBeGreaterThan(0);
    expect(visible.length).toBeLessThanOrEqual(8);
    expect(visible.every((upgrade) => upgrade.cost <= state.chronons)).toBe(true);
  });

  it('shows four cheapest unlocked upgrades when none are affordable', () => {
    const state = createInitialState();
    state.totalChrononsEarned = 1_000_000;
    state.generators.chronoShard = 60;
    state.chronons = 0;

    const unlocked = UPGRADES.filter((upgrade) => isUpgradeUnlocked(state, upgrade) && !state.purchasedUpgrades.includes(upgrade.id)).sort(
      (a, b) => a.cost - b.cost,
    );
    const visible = getVisibleUpgrades(state, UPGRADES);

    expect(visible.map((upgrade) => upgrade.id)).toEqual(unlocked.slice(0, 4).map((upgrade) => upgrade.id));
  });

  it('calculates paradox gain curve', () => {
    expect(getProjectedParadoxGain(PRESTIGE_REQUIREMENT_BASELINE - 1)).toBe(0);
    expect(getProjectedParadoxGain(PRESTIGE_REQUIREMENT_BASELINE)).toBe(1);
  });
});
