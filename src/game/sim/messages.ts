export type CurrencyId = 'seconds' | 'minutes' | 'hours';
export type BuyAmountMode = 1 | 10 | 'max';

export interface GeneratorDef {
  id: string;
  name: string;
  baseCost: number;
  growth: number;
  baseProduction: number;
}

export interface UpgradeDef {
  id: string;
  name: string;
  description: string;
  cost: number;
  currency: CurrencyId;
  type:
    | 'globalMultiplier'
    | 'generatorMultiplier'
    | 'unlockMinutes'
    | 'unlockHours'
    | 'autoClick'
    | 'costCompression';
  value: number;
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
  seconds: number;
  minutes: number;
  hours: number;
  totalHours: number;
  paradoxPoints: number;
  generators: Record<string, number>;
  purchasedUpgrades: string[];
  purchasedParadoxUpgrades: string[];
  autoConvertSecondsToMinutes: boolean;
  autoConvertMinutesToHours: boolean;
  compactNumbers: boolean;
  buyMode: BuyAmountMode;
  unlockedMinutes: boolean;
  unlockedHours: boolean;
  lastTickAt: number;
  lastSavedAt: number;
  log: string[];
}

export type WorkerAction =
  | { type: 'CLICK' }
  | { type: 'BUY_GENERATOR'; payload: { id: string; amountMode: BuyAmountMode } }
  | { type: 'BUY_UPGRADE'; payload: { id: string } }
  | { type: 'BUY_PARADOX_UPGRADE'; payload: { id: string } }
  | {
      type: 'TOGGLE_AUTOCONVERT';
      payload: { currency: 'minutes' | 'hours'; enabled: boolean };
    }
  | { type: 'SET_BUY_MODE'; payload: { mode: BuyAmountMode } }
  | { type: 'TOGGLE_COMPACT_NUMBERS'; payload: { enabled: boolean } }
  | { type: 'PRESTIGE' }
  | { type: 'IMPORT_STATE'; payload: { state: GameState } }
  | { type: 'HARD_RESET' }
  | { type: 'REQUEST_SNAPSHOT' };

export type WorkerOutboundMessage =
  | { type: 'SNAPSHOT'; payload: { state: GameState; rates: Record<CurrencyId, number>; projectedParadoxGain: number } }
  | { type: 'SAVED'; payload: { savedAt: number } };

export interface PersistedSave {
  version: number;
  state: GameState;
  savedAt: number;
}
