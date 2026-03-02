# Time Loop Architect

Time Loop Architect is a production-style incremental/idle web game built with **Next.js App Router + TypeScript + Tailwind + Zustand + Dexie + Web Workers**.

## Architecture

- **Authoritative simulation in Web Worker** (`src/game/sim/worker.ts`).
- UI sends typed actions; worker mutates state via reducer and posts snapshots.
- Tick loop runs at **20 TPS** (50ms interval), with snapshots throttled to ~10fps.
- UI keeps a read model in Zustand (`src/game/store/useGameStore.ts`).

## Content locations

- Generators: `src/game/content/generators.ts`
- Regular upgrades: `src/game/content/upgrades.ts`
- Paradox upgrades: `src/game/content/paradoxUpgrades.ts`

Add new items by extending these data lists.

## Saves & persistence

- Primary persistence: Dexie IndexedDB database `time-loop-architect`, single slot `slot-1`.
- Fallback persistence: `localStorage` if IndexedDB/Dexie fails.
- Autosave every 10 seconds.
- Export/Import uses base64-encoded versioned JSON save payloads.

## Development

```bash
npm install
npm run dev
```

## Checks

```bash
npm run lint
npm run test
npm run build
```
