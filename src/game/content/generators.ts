import { GeneratorDef } from '@/src/game/sim/messages';

export const GENERATORS: GeneratorDef[] = [
  {
    id: 'chronoShard',
    name: 'Chrono Shard',
    baseCost: 12,
    growth: 1.14,
    baseProduction: 0.25,
    iconPath: '/assets/time-loop/icon_chrono_shard.png',
  },
  {
    id: 'timeAnchor',
    name: 'Time Anchor',
    baseCost: 90,
    growth: 1.145,
    baseProduction: 1.8,
    iconPath: '/assets/time-loop/icon_time_anchor.png',
  },
  {
    id: 'loopEngine',
    name: 'Loop Engine',
    baseCost: 620,
    growth: 1.15,
    baseProduction: 12,
    iconPath: '/assets/time-loop/icon_loop_engine.png',
  },
  {
    id: 'hourglassProtocol',
    name: 'Hourglass Protocol',
    baseCost: 4_200,
    growth: 1.16,
    baseProduction: 68,
    iconPath: '/assets/time-loop/icon_hourglass_protocol.png',
  },
  {
    id: 'temporalAnomaly',
    name: 'Temporal Anomaly',
    baseCost: 27_000,
    growth: 1.17,
    baseProduction: 380,
    iconPath: '/assets/time-loop/icon_temporal_anomaly.png',
  },
  {
    id: 'paradoxCore',
    name: 'Paradox Core',
    baseCost: 175_000,
    growth: 1.18,
    baseProduction: 2_000,
    iconPath: '/assets/time-loop/icon_paradox_core.png',
  },
];
