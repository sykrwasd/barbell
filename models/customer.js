const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone_number: { type: String, required: true },
  service: { type: String, required: true },
  remarks: { type: String },
  
});

export default mongoose.models.item || mongoose.model("customer", customerSchema);

