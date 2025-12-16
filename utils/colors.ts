/**
 * Lighten a hex color by a percentage
 * @param color hex string, e.g. "#1E90FF"
 * @param percent number 0-100
 */
export function lightenColor(color: string, percent: number) {
  const num = parseInt(color.replace("#", ""), 16);
  let r = (num >> 16) + Math.round(2.55 * percent);
  let g = ((num >> 8) & 0x00ff) + Math.round(2.55 * percent);
  let b = (num & 0x0000ff) + Math.round(2.55 * percent);

  r = r > 255 ? 255 : r;
  g = g > 255 ? 255 : g;
  b = b > 255 ? 255 : b;

  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}
