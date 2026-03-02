import { GENERATORS } from '@/src/game/content/generators';
import { PARADOX_UPGRADES } from '@/src/game/content/paradoxUpgrades';
import { UPGRADES } from '@/src/game/content/upgrades';
import { BuyAmountMode, GameState } from '@/src/game/sim/messages';

export const CLICK_BASE = 1;

export const getTotalCost = (baseCost: number, growth: number, owned: number, amount: number): number => {
  if (amount <= 0) return 0;
  return baseCost * ((growth ** owned) * (growth ** amount - 1)) / (growth - 1);
};

export const calculateAffordableAmount = (
  currencyAmount: number,
  baseCost: number,
  growth: number,
  owned: number,
): number => {
  let low = 0;
  let high = 1;
  while (getTotalCost(baseCost, growth, owned, high) <= currencyAmount) {
    high *= 2;
    if (high > 1_000_000) break;
  }
  while (low < high) {
    const mid = Math.ceil((low + high) / 2);
    if (getTotalCost(baseCost, growth, owned, mid) <= currencyAmount) {
      low = mid;
    } else {
      high = mid - 1;
    }
  }
  return low;
};

export const resolveBuyAmount = (
  mode: BuyAmountMode,
  availableSeconds: number,
  baseCost: number,
  growth: number,
  owned: number,
): number => {
  if (mode === 'max') {
    return calculateAffordableAmount(availableSeconds, baseCost, growth, owned);
  }
  return mode;
};

export const getCostCompression = (state: GameState): number => {
  const regular = UPGRADES.filter(
    (u) => u.type === 'costCompression' && state.purchasedUpgrades.includes(u.id),
  ).reduce((acc, u) => acc + u.value, 0);

  const paradox = PARADOX_UPGRADES.filter(
    (u) => u.type === 'costCompression' && state.purchasedParadoxUpgrades.includes(u.id),
  ).reduce((acc, u) => acc + u.value, 0);

  return regular + paradox;
};

export const getGlobalMultiplier = (state: GameState): number => {
  const regular = UPGRADES.filter(
    (u) => u.type === 'globalMultiplier' && state.purchasedUpgrades.includes(u.id),
  ).reduce((acc, u) => acc * u.value, 1);

  const paradox = PARADOX_UPGRADES.filter(
    (u) => u.type === 'globalMultiplier' && state.purchasedParadoxUpgrades.includes(u.id),
  ).reduce((acc, u) => acc * u.value, 1);

  const pointsBonus = 1 + state.paradoxPoints * 0.05;
  return regular * paradox * pointsBonus;
};

export const getGeneratorMultiplier = (state: GameState): number =>
  UPGRADES.filter((u) => u.type === 'generatorMultiplier' && state.purchasedUpgrades.includes(u.id)).reduce(
    (acc, u) => acc * u.value,
    1,
  );

export const getAutoClicksPerSecond = (state: GameState): number => {
  const regular = UPGRADES.filter(
    (u) => u.type === 'autoClick' && state.purchasedUpgrades.includes(u.id),
  ).reduce((acc, u) => acc + u.value, 0);
  const paradox = PARADOX_UPGRADES.filter(
    (u) => u.type === 'autoClick' && state.purchasedParadoxUpgrades.includes(u.id),
  ).reduce((acc, u) => acc + u.value, 0);
  return regular + paradox;
};

export const getSecondsPerSecond = (state: GameState): number => {
  const generatorMult = getGeneratorMultiplier(state);
  const globalMult = getGlobalMultiplier(state);
  const generated = GENERATORS.reduce((acc, generator) => {
    const owned = state.generators[generator.id] ?? 0;
    return acc + owned * generator.baseProduction;
  }, 0);

  return (generated + getAutoClicksPerSecond(state) * CLICK_BASE) * generatorMult * globalMult;
};

export const getProjectedParadoxGain = (totalHours: number): number => Math.floor(totalHours ** 0.7);
