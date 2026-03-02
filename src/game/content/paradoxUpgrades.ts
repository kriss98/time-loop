import { ParadoxUpgradeDef } from '@/src/game/sim/messages';

export const PARADOX_UPGRADES: ParadoxUpgradeDef[] = [
  { id: 'echo-memory', name: 'Echo Memory', description: 'Permanent global production x1.15', cost: 1, type: 'globalMultiplier', value: 1.15 },
  { id: 'residual-clicks', name: 'Residual Clicks', description: 'Permanent +1 auto-click per second', cost: 2, type: 'autoClick', value: 1 },
  { id: 'phase-bracing', name: 'Phase Bracing', description: 'Permanent generator growth reduction', cost: 2, type: 'costCompression', value: 0.005 },
  { id: 'causal-sieve', name: 'Causal Sieve', description: 'Permanent global production x1.25', cost: 4, type: 'globalMultiplier', value: 1.25 },
  { id: 'event-weave', name: 'Event Weave', description: 'Permanent +2 auto-click per second', cost: 6, type: 'autoClick', value: 2 },
  { id: 'singularity-lens', name: 'Singularity Lens', description: 'Permanent global production x1.4', cost: 10, type: 'globalMultiplier', value: 1.4 },
];
