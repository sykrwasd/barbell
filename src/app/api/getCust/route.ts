import { connectToDatabase } from "@/../lib/mongoose.js";
import Customer from "@/../models/customer.js";
import Slot from "@/../models/slot.js";

await connectToDatabase();

export async function GET(req: Request) {
  try {
    const cust = await Customer.find().sort({date_book: 1 });

    console.log(cust);
    return new Response(JSON.stringify(cust), { status: 200 });
    
  } catch (err) {
    return new Response(JSON.stringify({ error: "Failed to fetch items" }), { status: 500 });
  }
}
