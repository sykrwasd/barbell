import { connectToDatabase } from "@/../lib/mongoose.js";
import Customer from "@/../models/customer.js";
import Slot from "@/../models/slot.js";

await connectToDatabase();

export async function POST(req: Request) {

  try {
    const { name,phone_number,service,remarks,date_book,time_book } = await req.json()

    let price = 0;

    if(service === "haircut"){
      price = 20;
    } else  if (service ==="beard-trim"){
      price = 5
    } else {
      price = 30
    }

    const status = "pending"

    console.log("req.body");
    console.log(
      name + phone_number + service + remarks + date_book + time_book
    );  
    

    const newCustomer  = new Customer ({
      name: name,
      phone_number: phone_number,
      service: service,
      remarks: remarks,
      date_book: date_book,
      time_book: time_book,
      price: price,
      status: status

    }) 

    await newCustomer.save();
    return new Response(JSON.stringify({ message: "Book added successfully" }), { status: 200 });
    
    
  } catch (err) {
    return new Response(JSON.stringify({ error: "Failed to add book" }), { status: 500 });
  }
}



// export default async function handler(req, res) {
//   if (req.method !== "POST") {
//     return res.status(405).json({ error: "Method not allowed" });
//   }

//   try {
//     await connectToDatabase();

//     const { name, price } = req.body;
//     console.log(name,price)

//     if (!name || !price) {
//       return res.status(400).json({ error: "Item name and price are required" });
//     }

//     if (isNaN(price) || price <= 0) {
//       return res.status(400).json;
//     }

//     const newItem = new Item({
//       itemName: name,
//       itemPrice: Number(price),
//     });

//     await newItem.save();

//     return res.status(201).json({ message: "Item added successfully", item: newItem });
//   } catch (err) {
//     console.error("Error adding item:", err);
//     return res.status(500).json({ error: "Failed to add item" });
//   }
// }
