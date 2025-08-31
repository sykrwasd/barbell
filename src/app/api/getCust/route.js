import { connectToDatabase } from "@/../lib/mongoose.js";
import Customer from "@/../models/customer.js";

await connectToDatabase();

export async function GET(req) {
  try {
    const cust = await Customer.find({});
    return new Response(JSON.stringify(cust), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Failed to fetch items" }), { status: 500 });
  }
}
