  const mongoose = require('mongoose');

  // Customer Schema
  const customerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone_number: { type: String, required: true },
    service: { type: String, required: true },
    remarks: { type: String },
    date_book: { type: String, required: true },
    time_book: { type: String, required: true }, // e.g. "10:00 AM"
    price: {type: Number, required: true},
    status: { type: String, required: true },

  });

  export default mongoose.models.customer || mongoose.model("customer", customerSchema);
