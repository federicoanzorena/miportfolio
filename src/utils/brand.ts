export interface BrandDot {
  x: number;
  y: number;
  r: number;
}

export const BININFINITO_DOTS: BrandDot[] = [
  // Lóbulo izquierdo
  { x: 11.4, y: 12, r: 1.5 },
  { x: 9.2, y: 15.8, r: 1.05 },
  { x: 4.8, y: 15.8, r: 1.5 },
  { x: 2.6, y: 12, r: 1.05 },
  { x: 4.8, y: 8.2, r: 1.5 },
  { x: 9.2, y: 8.2, r: 1.05 },
  // Lóbulo derecho
  { x: 21.4, y: 12, r: 1.5 },
  { x: 19.2, y: 15.8, r: 1.05 },
  { x: 14.8, y: 15.8, r: 1.5 },
  { x: 12.6, y: 12, r: 1.05 },
  { x: 14.8, y: 8.2, r: 1.5 },
  { x: 19.2, y: 8.2, r: 1.05 },
  // Cruce central
  { x: 12, y: 10.6, r: 1.05 },
  { x: 12, y: 13.4, r: 1.05 },
];
