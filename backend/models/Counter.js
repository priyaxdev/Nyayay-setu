import mongoose from 'mongoose';

const { Schema } = mongoose;

// Backs atomic, gap-free-ish sequence numbers for human-readable complaint IDs
// (e.g. CMP-2026-000001). One counter document per year.
const CounterSchema = new Schema({
  _id: { type: String, required: true }, // e.g. "complaint-2026"
  seq: { type: Number, default: 0 },
});

export default mongoose.model('Counter', CounterSchema);
