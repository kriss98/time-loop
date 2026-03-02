const SUFFIXES = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi'];

export const formatNumber = (value: number, compact: boolean): string => {
  if (!Number.isFinite(value)) return '∞';
  if (!compact) return Math.floor(value).toLocaleString();
  const abs = Math.abs(value);
  if (abs < 1000) return value.toFixed(abs < 10 ? 2 : 1).replace(/\.0+$/, '');

  const tier = Math.min(Math.floor(Math.log10(abs) / 3), SUFFIXES.length - 1);
  const scaled = value / 10 ** (tier * 3);
  const fixed = scaled >= 100 ? 1 : scaled >= 10 ? 2 : 3;
  return `${scaled.toFixed(fixed).replace(/\.0+$/, '')}${SUFFIXES[tier]}`;
};
