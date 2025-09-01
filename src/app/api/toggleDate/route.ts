import { connectToDatabase } from "@/../lib/mongoose.js";
import Date from "@/../models/date";

await connectToDatabase();

export async function POST(req: Request) {
  const { dateStr } = await req.json();
  console.log("dateStr", dateStr);

  try {
    let record = await Date.findOne({ date: dateStr });

    if (record) {
      record.isOpen = !record.isOpen; // if true, tukar kepada false
    } else {
      record = new Date({ date: dateStr, isOpen: true }); // if not exist, create a new available date
    }

    await record.save();

    return new Response(JSON.stringify("Date Updated"), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Failed to fetch items" }), {
      status: 500,
    });
  }
}
