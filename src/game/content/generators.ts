import { GeneratorDef } from '@/src/game/sim/messages';

export const GENERATORS: GeneratorDef[] = [
  { id: 'chronoShard', name: 'Chrono Shard', baseCost: 15, growth: 1.15, baseProduction: 0.1 },
  { id: 'timeAnchor', name: 'Time Anchor', baseCost: 120, growth: 1.15, baseProduction: 1 },
  { id: 'loopEngine', name: 'Loop Engine', baseCost: 900, growth: 1.16, baseProduction: 8 },
];
