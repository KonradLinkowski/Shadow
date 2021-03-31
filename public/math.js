export function getSightPolygon(sightX, sightY, segments) {
  // Get all unique points
  const points = segments.flatMap(s => [s.a, s.b])
  const uniquePoints = (points => {
    const set = {}
    return points.filter(p => {
      const key = `${p.x}|${p.y}`
      if (key in set) return false
      return set[key] = true
    })
  })(points)

  // Get all angles
  const uniqueAngles = uniquePoints.flatMap(point => {
    const angle = Math.atan2(point.y - sightY, point.x - sightX);
    point.angle = angle;
    return [angle - 0.00001, angle, angle + 0.00001]
  })

  // RAYS IN ALL DIRECTIONS
  const intersects = [];
  for (const angle of uniqueAngles) {
    // Calculate dx & dy from angle
    const dx = Math.cos(angle);
    const dy = Math.sin(angle);

    // Ray from center of screen to mouse
    const ray = {
      a: { x: sightX, y: sightY },
      b: { x: sightX + dx, y: sightY + dy }
    };

    // Find CLOSEST intersection
    let closestIntersect = null;
    for (const segment of segments) {
      const intersect = getIntersection(ray, segment);
      if (!intersect) continue;
      if (!closestIntersect || intersect.param < closestIntersect.param) {
        closestIntersect = intersect;
      }
    }

    // Intersect angle
    if (!closestIntersect) continue;
    closestIntersect.angle = angle;

    // Add to list of intersects
    intersects.push(closestIntersect);

  }

  // Sort intersects by angle
  intersects.sort((a, b) => a.angle - b.angle);

  // Polygon is intersects, in order of angle
  return intersects;

}

function getIntersection(ray, segment) {
  // RAY in parametric: Point + Delta*T1
  const r_px = ray.a.x;
  const r_py = ray.a.y;
  const r_dx = ray.b.x - ray.a.x;
  const r_dy = ray.b.y - ray.a.y;

  // SEGMENT in parametric: Point + Delta*T2
  const s_px = segment.a.x;
  const s_py = segment.a.y;
  const s_dx = segment.b.x - segment.a.x;
  const s_dy = segment.b.y - segment.a.y;

  // Are they parallel? If so, no intersect
  const r_mag = Math.sqrt(r_dx * r_dx + r_dy * r_dy);
  const s_mag = Math.sqrt(s_dx * s_dx + s_dy * s_dy);
  if (r_dx / r_mag == s_dx / s_mag && r_dy / r_mag == s_dy / s_mag) {
    // Unit vectors are the same.
    return null;
  }

  const T2 = (r_dx * (s_py - r_py) + r_dy * (r_px - s_px)) / (s_dx * r_dy - s_dy * r_dx);
  const T1 = (s_px + s_dx * T2 - r_px) / r_dx;

  // Must be within parametic whatevers for RAY/SEGMENT
  if (T1 < 0) return null;
  if (T2 < 0 || T2 > 1) return null;

  // Return the POINT OF INTERSECTION
  return {
    x: r_px + r_dx * T1,
    y: r_py + r_dy * T1,
    param: T1
  };
}
