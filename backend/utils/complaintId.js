import Counter from '../models/Counter.js';

/**
 * Generates a human-readable, unique complaint ID like "CMP-2026-000001".
 * Uses a per-year counter document with an atomic $inc so concurrent
 * submissions never collide (unlike, say, "count existing docs + 1").
 */
export async function generateComplaintId() {
  const year = new Date().getFullYear();
  const counterId = `complaint-${year}`;

  const counter = await Counter.findOneAndUpdate(
    { _id: counterId },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  const padded = String(counter.seq).padStart(6, '0');
  return `CMP-${year}-${padded}`;
}
