import { GENERATORS } from '@/src/game/content/generators';
import { PARADOX_UPGRADES } from '@/src/game/content/paradoxUpgrades';
import { UPGRADES } from '@/src/game/content/upgrades';
import { BuyAmountMode, GameState, UpgradeDef } from '@/src/game/sim/messages';

export const PRESTIGE_REQUIREMENT_BASELINE = 5_000_000;

export const getTotalCost = (baseCost: number, growth: number, owned: number, amount: number): number => {
  if (amount <= 0) return 0;
  return (baseCost * (growth ** owned) * (growth ** amount - 1)) / (growth - 1);
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
  availableChronons: number,
  baseCost: number,
  growth: number,
  owned: number,
): number => {
  if (mode === 'max') {
    return calculateAffordableAmount(availableChronons, baseCost, growth, owned);
  }
  return mode;
};

export const isUpgradeUnlocked = (state: GameState, upgrade: UpgradeDef): boolean => {
  if (!upgrade.unlock) return true;
  if (upgrade.unlock.totalChrononsEarned && state.totalChrononsEarned < upgrade.unlock.totalChrononsEarned) {
    return false;
  }

  if (upgrade.unlock.generatorsOwned) {
    return Object.entries(upgrade.unlock.generatorsOwned).every(
      ([generatorId, required]) => (state.generators[generatorId] ?? 0) >= required,
    );
  }

  return true;
};

export const getVisibleUpgrades = (state: GameState, upgrades: UpgradeDef[]): UpgradeDef[] => {
  const unlockedUnpurchased = upgrades
    .filter((upgrade) => !state.purchasedUpgrades.includes(upgrade.id) && isUpgradeUnlocked(state, upgrade))
    .sort((a, b) => a.cost - b.cost);

  if (unlockedUnpurchased.length <= 4) {
    return unlockedUnpurchased;
  }

  const affordable = unlockedUnpurchased.filter((upgrade) => upgrade.cost <= state.chronons);

  if (affordable.length === 0) {
    return unlockedUnpurchased.slice(0, 4);
  }

  return affordable.slice(0, 8);
};

export const describeUpgradeUnlock = (upgrade: UpgradeDef): string => {
  if (!upgrade.unlock) return 'Available now';

  const conditions: string[] = [];
  if (upgrade.unlock.totalChrononsEarned) {
    conditions.push(`Earn ${upgrade.unlock.totalChrononsEarned.toLocaleString()} total Chronons`);
  }
  if (upgrade.unlock.generatorsOwned) {
    Object.entries(upgrade.unlock.generatorsOwned).forEach(([generatorId, required]) => {
      const generator = GENERATORS.find((g) => g.id === generatorId);
      conditions.push(`Own ${required} ${generator?.name ?? generatorId}`);
    });
  }

  return conditions.join(' • ');
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

const getGeneratorTierMultiplier = (state: GameState, generatorId: string): number =>
  UPGRADES.filter(
    (u) => u.type === 'generatorTierMultiplier' && u.generatorId === generatorId && state.purchasedUpgrades.includes(u.id),
  ).reduce((acc, u) => acc * u.value, 1);

const getGeneratorSynergyMultiplier = (state: GameState, generatorId: string): number =>
  UPGRADES.filter(
    (u) => u.type === 'generatorSynergy' && u.generatorId === generatorId && state.purchasedUpgrades.includes(u.id),
  ).reduce((acc, u) => {
    const sourceId = u.sourceGeneratorId;
    if (!sourceId) return acc;
    const sourceOwned = state.generators[sourceId] ?? 0;
    return acc * (1 + sourceOwned * u.value);
  }, 1);

export const getClickPower = (state: GameState): number => {
  const flatBonus = UPGRADES.filter((u) => u.type === 'clickFlat' && state.purchasedUpgrades.includes(u.id)).reduce(
    (acc, u) => acc + u.value,
    0,
  );

  const clickMultiplier = UPGRADES.filter((u) => u.type === 'clickMultiplier' && state.purchasedUpgrades.includes(u.id)).reduce(
    (acc, u) => acc * u.value,
    1,
  );

  const clickSynergyMultiplier = UPGRADES.filter((u) => u.type === 'clickSynergy' && state.purchasedUpgrades.includes(u.id)).reduce(
    (acc, u) => {
      const sourceId = u.sourceGeneratorId;
      if (!sourceId) return acc;
      const sourceOwned = state.generators[sourceId] ?? 0;
      return acc * (1 + sourceOwned * u.value);
    },
    1,
  );

  return (state.clickPower + flatBonus) * clickMultiplier * clickSynergyMultiplier;
};

export const getAutoClicksPerSecond = (state: GameState): number => {
  const regular = UPGRADES.filter(
    (u) => u.type === 'autoClick' && state.purchasedUpgrades.includes(u.id),
  ).reduce((acc, u) => acc + u.value, 0);
  const paradox = PARADOX_UPGRADES.filter(
    (u) => u.type === 'autoClick' && state.purchasedParadoxUpgrades.includes(u.id),
  ).reduce((acc, u) => acc + u.value, 0);
  return regular + paradox;
};

export const getChrononsPerSecond = (state: GameState): number => {
  const baseGeneratorMult = getGeneratorMultiplier(state);
  const globalMult = getGlobalMultiplier(state);

  const generated = GENERATORS.reduce((acc, generator) => {
    const owned = state.generators[generator.id] ?? 0;
    const multiplier =
      baseGeneratorMult * getGeneratorTierMultiplier(state, generator.id) * getGeneratorSynergyMultiplier(state, generator.id);
    return acc + owned * generator.baseProduction * multiplier;
  }, 0);

  const autoClickContribution = getAutoClicksPerSecond(state) * getClickPower(state);
  return (generated + autoClickContribution) * globalMult;
};

export const getProjectedParadoxGain = (totalChrononsEarned: number): number => {
  if (totalChrononsEarned < PRESTIGE_REQUIREMENT_BASELINE) return 0;
  return Math.floor((totalChrononsEarned / PRESTIGE_REQUIREMENT_BASELINE) ** 0.65);
};
