import { GeneratorDef } from '@/src/game/sim/messages';

export const GENERATORS: GeneratorDef[] = [
  {
    id: 'chronoShard',
    name: 'Chrono Shard',
    baseCost: 15,
    growth: 1.16,
    baseProduction: 0.12,
    iconPath: '/assets/time-loop/icon_chrono_shard.png',
  },
  {
    id: 'timeAnchor',
    name: 'Time Anchor',
    baseCost: 140,
    growth: 1.162,
    baseProduction: 0.9,
    iconPath: '/assets/time-loop/icon_time_anchor.png',
  },
  {
    id: 'loopEngine',
    name: 'Loop Engine',
    baseCost: 1_200,
    growth: 1.164,
    baseProduction: 5.5,
    iconPath: '/assets/time-loop/icon_loop_engine.png',
  },
  {
    id: 'hourglassProtocol',
    name: 'Hourglass Protocol',
    baseCost: 10_000,
    growth: 1.166,
    baseProduction: 30,
    iconPath: '/assets/time-loop/icon_hourglass_protocol.png',
  },
  {
    id: 'temporalAnomaly',
    name: 'Temporal Anomaly',
    baseCost: 85_000,
    growth: 1.168,
    baseProduction: 170,
    iconPath: '/assets/time-loop/icon_temporal_anomaly.png',
  },
  {
    id: 'paradoxCore',
    name: 'Paradox Core',
    baseCost: 700_000,
    growth: 1.17,
    baseProduction: 900,
    iconPath: '/assets/time-loop/icon_paradox_core.png',
  },
];
