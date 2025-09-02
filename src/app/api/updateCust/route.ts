// app/api/customers/status/route.ts
import { connectToDatabase } from "@/../lib/mongoose";
import Customer from "@/../models/customer";

export async function POST(req: Request) {
  await connectToDatabase();

  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return new Response(
        JSON.stringify({ error: "Missing id or status" }),
        { status: 400 }
      );
    }

    const updatedCustomer = await Customer.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedCustomer) {
      return new Response(
        JSON.stringify({ error: "Customer not found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({
        message: "Status updated successfully",
        updatedCustomer,
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Update status error:", err);
    return new Response(
      JSON.stringify({ error: "Failed to update" }),
      { status: 500 }
    );
  }
}
