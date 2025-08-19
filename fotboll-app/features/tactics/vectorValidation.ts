export type Arrow = { from: { x: number; y: number }; to: { x: number; y: number }; kind: 'attack' | 'defense' };

export type VectorSpec = {
  from: { x: number; y: number };
  to: { x: number; y: number };
  kind: 'attack' | 'defense';
  angleToleranceDeg?: number;
  minLength?: number;
  maxLength?: number;
};

function angleBetweenDeg(a: Arrow, b: VectorSpec): number {
  const v1x = a.to.x - a.from.x;
  const v1y = a.to.y - a.from.y;
  const v2x = b.to.x - b.from.x;
  const v2y = b.to.y - b.from.y;
  const dot = v1x * v2x + v1y * v2y;
  const m1 = Math.hypot(v1x, v1y) || 1;
  const m2 = Math.hypot(v2x, v2y) || 1;
  const cos = Math.max(-1, Math.min(1, dot / (m1 * m2)));
  const rad = Math.acos(cos);
  return (rad * 180) / Math.PI;
}

export function arrowsSatisfy(arrows: Arrow[], expected: VectorSpec[]): boolean {
  const used = new Set<number>();
  return expected.every((spec) => {
    const tol = spec.angleToleranceDeg ?? 20;
    const minL = spec.minLength ?? 0.05;
    const maxL = spec.maxLength ?? 1.5;
    for (let i = 0; i < arrows.length; i++) {
      if (used.has(i)) continue;
      const a = arrows[i];
      if (a.kind !== spec.kind) continue;
      const len = Math.hypot(a.to.x - a.from.x, a.to.y - a.from.y);
      if (len < minL || len > maxL) continue;
      const ang = angleBetweenDeg(a, spec);
      if (ang <= tol) {
        used.add(i);
        return true;
      }
    }
    return false;
  });
}

