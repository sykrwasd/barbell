import { connectToDatabase } from "@/../lib/mongoose.js";
import Date from "@/../models/date.js";

await connectToDatabase();

export async function GET(req: Request) {
  try {
    const date = await Date.find({});

    console.log(date);
    return new Response(JSON.stringify(date), { status: 200 });
    
  } catch (err) {
    return new Response(JSON.stringify({ error: "Failed to fetch items" }), { status: 500 });
  }
}
