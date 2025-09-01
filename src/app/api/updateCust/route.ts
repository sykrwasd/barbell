import { connectToDatabase } from "@/../lib/mongoose";
import Customer from "@/../models/customer";

export async function PUT(req: Request) {
  await connectToDatabase();

  try {
    const body = await req.json(); // read body once
    const { id, status } = body;   // id and status sent in body

    if (!id || !status) {
      return new Response(JSON.stringify({ error: "Missing id or status" }), { status: 400 });
    }

    const updatedCustomer = await Customer.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedCustomer) {
      return new Response(JSON.stringify({ error: "Customer not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ updatedCustomer }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Failed to update" }), { status: 500 });
  }
}
