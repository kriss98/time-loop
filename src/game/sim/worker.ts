/// <reference lib="webworker" />
import { getProjectedParadoxGain, getSecondsPerSecond } from '@/src/game/economy/formulas';
import { migrateSave } from '@/src/game/persistence/migrate';
import { reduceAction, createInitialState } from '@/src/game/sim/reducer';
import { applyTick } from '@/src/game/sim/simCore';
import { applyOfflineProgress } from '@/src/game/sim/offline';
import { PersistedSave, WorkerAction, WorkerOutboundMessage } from '@/src/game/sim/messages';

let state = createInitialState();
let lastTime = performance.now();
let snapAccumulator = 0;

const postSnapshot = (): void => {
  const message: WorkerOutboundMessage = {
    type: 'SNAPSHOT',
    payload: {
      state,
      rates: { seconds: getSecondsPerSecond(state), minutes: 0, hours: 0 },
      projectedParadoxGain: getProjectedParadoxGain(state.totalHours),
    },
  };
  self.postMessage(message);
};

const tick = (): void => {
  const now = performance.now();
  const dt = (now - lastTime) / 1000;
  lastTime = now;
  state = applyTick(state, Math.min(dt, 0.5));
  snapAccumulator += dt;
  if (snapAccumulator >= 0.1) {
    snapAccumulator = 0;
    postSnapshot();
  }
};

setInterval(tick, 50);

self.onmessage = (event: MessageEvent<WorkerAction>) => {
  const action = event.data;
  if (action.type === 'IMPORT_STATE') {
    state = migrateSave({ version: action.payload.state.version, state: action.payload.state, savedAt: Date.now() }).state;
    postSnapshot();
    return;
  }

  if (action.type === 'REQUEST_SNAPSHOT') {
    postSnapshot();
    return;
  }

  state = reduceAction(state, action);
  postSnapshot();
};

export const loadWorkerState = (save: PersistedSave | null): void => {
  if (save) {
    const migrated = migrateSave(save);
    state = applyOfflineProgress(migrated.state);
  }
  postSnapshot();
};
