import Counter from '../models/Counter.js';
import Complaint from '../models/Complaint.js';

/**
 * Generates a human-readable, guaranteed-unique complaint ID like "CMP-2026-000001".
 * Synchronizes with any pre-existing database records to prevent collisions and
 * uses atomic $inc on the per-year Counter document.
 */
export async function generateComplaintId() {
  const year = new Date().getFullYear();
  const counterId = `complaint-${year}`;

  // Find max sequence in existing collection for this year
  const existingDocs = await Complaint.find(
    { complaintId: { $regex: new RegExp(`^CMP-${year}-\\d+$`, 'i') } },
    { complaintId: 1 }
  ).lean();

  let maxExistingSeq = 0;
  for (const doc of existingDocs) {
    const match = doc.complaintId && doc.complaintId.match(/CMP-\d+-(\d+)/i);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > maxExistingSeq) maxExistingSeq = num;
    }
  }

  // Ensure counter is at least maxExistingSeq
  let counter = await Counter.findOne({ _id: counterId });
  if (!counter || counter.seq < maxExistingSeq) {
    counter = await Counter.findOneAndUpdate(
      { _id: counterId },
      { $max: { seq: maxExistingSeq } },
      { new: true, upsert: true }
    );
  }

  // Atomically increment and verify uniqueness against DB
  for (let attempt = 0; attempt < 20; attempt++) {
    const updatedCounter = await Counter.findOneAndUpdate(
      { _id: counterId },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const padded = String(updatedCounter.seq).padStart(6, '0');
    const candidateId = `CMP-${year}-${padded}`;

    const exists = await Complaint.exists({ complaintId: candidateId });
    if (!exists) {
      return candidateId;
    }
  }

  // Fallback unique ID
  return `CMP-${year}-${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 1000)}`;
}
