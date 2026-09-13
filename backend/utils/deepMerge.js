// backend/utils/deepMerge.js
/**
 * Deeply merges `source` into `target`.
 * - Recursively merges plain objects.
 * - Overwrites primitive values only when `source` is not null/undefined.
 * - For array fields (e.g., witnesses, evidence) merges uniquely based on deep equality.
 *   If the incoming array is empty, the original array is retained.
 */
export function deepMerge(target = {}, source = {}) {
  if (!source) return target;
  const isObject = (obj) => obj && typeof obj === 'object' && !Array.isArray(obj);
  const isArray = Array.isArray;

  for (const key of Object.keys(source)) {
    const srcVal = source[key];
    const tgtVal = target[key];

    if (srcVal === null || srcVal === undefined) continue;

    if (isArray(srcVal) && isArray(tgtVal)) {
      const merged = [...tgtVal];
      srcVal.forEach((item) => {
        if (!merged.some((e) => JSON.stringify(e) === JSON.stringify(item))) {
          merged.push(item);
        }
      });
      target[key] = merged;
    } else if (isObject(srcVal) && isObject(tgtVal)) {
      target[key] = deepMerge({ ...tgtVal }, srcVal);
    } else {
      target[key] = srcVal;
    }
  }
  return target;
}
