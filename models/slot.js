const mongoose = require('mongoose');

// Slot Schema
const slotSchema = new mongoose.Schema({
  date: { type: String, required: true },
  time: { type: String, required: true }, // e.g. "10:00 AM"
  availability: { type: Boolean, default: true },
});

export default mongoose.models.slot || mongoose.model("slot", slotSchema);
