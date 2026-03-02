import { GeneratorDef } from '@/src/game/sim/messages';

export const GENERATORS: GeneratorDef[] = [
  {
    id: 'chronoShard',
    name: 'Chrono Shard',
    baseCost: 15,
    growth: 1.15,
    baseProduction: 0.1,
    iconPath: '/assets/time-loop/icon_chrono_shard.png',
  },
  {
    id: 'timeAnchor',
    name: 'Time Anchor',
    baseCost: 120,
    growth: 1.15,
    baseProduction: 1,
    iconPath: '/assets/time-loop/icon_time_anchor.png',
  },
  {
    id: 'loopEngine',
    name: 'Loop Engine',
    baseCost: 900,
    growth: 1.16,
    baseProduction: 8,
    iconPath: '/assets/time-loop/icon_loop_engine.png',
  },
  {
    id: 'hourglassProtocol',
    name: 'Hourglass Protocol',
    baseCost: 7000,
    growth: 1.17,
    baseProduction: 48,
    iconPath: '/assets/time-loop/icon_hourglass_protocol.png',
  },
  {
    id: 'temporalAnomaly',
    name: 'Temporal Anomaly',
    baseCost: 50000,
    growth: 1.18,
    baseProduction: 260,
    iconPath: '/assets/time-loop/icon_temporal_anomaly.png',
  },
  {
    id: 'paradoxCore',
    name: 'Paradox Core',
    baseCost: 350000,
    growth: 1.19,
    baseProduction: 1400,
    iconPath: '/assets/time-loop/icon_paradox_core.png',
  },
];
