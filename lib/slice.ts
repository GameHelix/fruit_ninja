/**
 * Geometric helpers for slice detection.
 * A "slice" is a line segment from (x1,y1) to (x2,y2).
 * An object is a circle at (cx,cy) with radius r.
 */

/** Returns the minimum distance² from point (px,py) to segment (ax,ay)→(bx,by). */
function distSqPointToSegment(
  px: number, py: number,
  ax: number, ay: number,
  bx: number, by: number,
): number {
  const dx = bx - ax;
  const dy = by - ay;
  const lenSq = dx * dx + dy * dy;
  if (lenSq === 0) {
    // degenerate segment
    const ex = px - ax, ey = py - ay;
    return ex * ex + ey * ey;
  }
  let t = ((px - ax) * dx + (py - ay) * dy) / lenSq;
  t = Math.max(0, Math.min(1, t));
  const cx = ax + t * dx;
  const cy = ay + t * dy;
  const fx = px - cx, fy = py - cy;
  return fx * fx + fy * fy;
}

/** True when the segment intersects the circle. */
export function segmentIntersectsCircle(
  x1: number, y1: number,
  x2: number, y2: number,
  cx: number, cy: number,
  r: number,
): boolean {
  const dSq = distSqPointToSegment(cx, cy, x1, y1, x2, y2);
  return dSq <= r * r;
}

/**
 * Angle of the slice line (radians) — used to split the fruit into two halves.
 */
export function sliceAngle(x1: number, y1: number, x2: number, y2: number): number {
  return Math.atan2(y2 - y1, x2 - x1);
}
