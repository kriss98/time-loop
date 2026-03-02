import Dexie, { Table } from 'dexie';
import { SaveSlot } from '@/src/game/persistence/schema';

class TimeLoopDB extends Dexie {
  saves!: Table<SaveSlot, string>;

  constructor() {
    super('time-loop-architect');
    this.version(1).stores({ saves: 'id, savedAt' });
  }
}

export const db = new TimeLoopDB();
