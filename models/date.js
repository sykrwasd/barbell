const mongoose = require('mongoose');

const dateSchema = new mongoose.Schema({
  date: { type: Date, required: true, unique: true }, // only store the date
  isOpen: { type: Boolean, default: true },  
});

export default mongoose.models.date || mongoose.model("date", dateSchema);
