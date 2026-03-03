export type CurrencyId = 'chronons';
export type BuyAmountMode = 1 | 10 | 'max';

export interface AudioSettings {
  sfxEnabled: boolean;
  musicEnabled: boolean;
  sfxVolume: number;
  musicVolume: number;
}

export interface GeneratorDef {
  id: string;
  name: string;
  baseCost: number;
  growth: number;
  baseProduction: number;
  iconPath?: string;
}

export type UpgradeCategory = 'generator' | 'synergy' | 'global' | 'automation' | 'click';

export interface UpgradeUnlockCondition {
  totalChrononsEarned?: number;
  generatorsOwned?: Record<string, number>;
}

export interface UpgradeDef {
  id: string;
  name: string;
  description: string;
  effectLine: string;
  cost: number;
  currency: CurrencyId;
  category: UpgradeCategory;
  type:
    | 'globalMultiplier'
    | 'generatorMultiplier'
    | 'generatorTierMultiplier'
    | 'generatorSynergy'
    | 'clickFlat'
    | 'clickMultiplier'
    | 'clickSynergy'
    | 'autoClick'
    | 'costCompression';
  value: number;
  generatorId?: string;
  sourceGeneratorId?: string;
  unlock?: UpgradeUnlockCondition;
  iconPath?: string;
}

export interface ParadoxUpgradeDef {
  id: string;
  name: string;
  description: string;
  cost: number;
  type: 'globalMultiplier' | 'autoClick' | 'costCompression';
  value: number;
}

export interface GameState {
  version: number;
  chronons: number;
  totalChrononsEarned: number;
  paradoxPoints: number;
  clickPower: number;
  generators: Record<string, number>;
  purchasedUpgrades: string[];
  purchasedParadoxUpgrades: string[];
  compactNumbers: boolean;
  buyMode: BuyAmountMode;
  audio: AudioSettings;
  lastTickAt: number;
  lastSavedAt: number;
  log: string[];
}

export type WorkerAction =
  | { type: 'CLICK' }
  | { type: 'BUY_GENERATOR'; payload: { id: string; amountMode: BuyAmountMode } }
  | { type: 'BUY_UPGRADE'; payload: { id: string } }
  | { type: 'BUY_PARADOX_UPGRADE'; payload: { id: string } }
  | { type: 'SET_BUY_MODE'; payload: { mode: BuyAmountMode } }
  | { type: 'TOGGLE_COMPACT_NUMBERS'; payload: { enabled: boolean } }
  | { type: 'SET_AUDIO_SETTINGS'; payload: AudioSettings }
  | { type: 'PRESTIGE' }
  | { type: 'IMPORT_STATE'; payload: { state: GameState } }
  | { type: 'HARD_RESET' }
  | { type: 'REQUEST_SNAPSHOT' };

export type WorkerOutboundMessage =
  | {
      type: 'SNAPSHOT';
      payload: {
        state: GameState;
        rates: Record<CurrencyId, number>;
        projectedParadoxGain: number;
        chrononsPerSec: number;
      };
    }
  | { type: 'SAVED'; payload: { savedAt: number } };

export interface PersistedSave {
  version: number;
  state: GameState;
  savedAt: number;
}
