import { connectToDatabase } from "@/../lib/mongoose.js";
import Customer from "@/../models/customer.js";
import nodemailer from "nodemailer";


await connectToDatabase();

export async function POST(req: Request) {
  try {
    const { name, phone_number, service, remarks, date_book, time_book } =
      await req.json();

    const existingBooking = await Customer.findOne({
      phone_number: phone_number,
      date_book: date_book,
    });

    if (existingBooking) {
      return new Response(
        JSON.stringify({
          error: "This phone number has already booked for this date.",
        }),
        { status: 400 }
      );
    }

    let price = 0;

    if (service === "haircut") {
      price = 20;
    } else if (service === "beard-trim") {
      price = 5;
    } else {
      price = 30;
    }

    const status = "pending";

    console.log("req.body");
    console.log(
      name + phone_number + service + remarks + date_book + time_book
    );

    const newCustomer = new Customer({
      name: name,
      phone_number: phone_number,
      service: service,
      remarks: remarks,
      date_book: date_book,
      time_book: time_book,
      price: price,
      status: status,
    });

    await newCustomer.save();

    try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "umarsyakir16@gmail.com",
        pass: "qkvpinlhbmgzaypx", 
      },
    });

    const info = await transporter.sendMail({
      from: '"Barber Booking System" <umarsyakir16@gmail.com>', // change to your sender
      to: "umarsyakir16@gmail.com", // barber’s email
      subject: "📅 New Booking Received",
      text: `New booking received!

Customer Name: ${name}
Service: ${service}
Date: ${date_book}
Time: ${time_book}
Contact: ${phone_number}

Please be ready for the appointment.`,
      html: `
    <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px; max-width: 500px; margin: auto; background-color: #f9f9f9;">
      <h2 style="color: #333;">💈 New Booking Confirmation</h2>
      <p>A new customer has booked a slot with you. Here are the details:</p>
      
      <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Customer Name</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${name}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Service</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${service}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Date</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${date_book}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Time</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${time_book}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Customer Email</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${phone_number}</td>
        </tr>
         <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Remarks</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${remarks}</td>
        </tr>
      </table>

      <p style="margin-top: 20px; color: #555;">
        Please prepare for the appointment and ensure everything is ready for your customer.
      </p>

      <p style="margin-top: 20px; font-size: 12px; color: #aaa;">
        This is an automated message from your booking system.
      </p>
    </div>
  `,
    });


    console.log("Message sent:", info.messageId);
  

  } catch (error) {
    console.error("Email sending failed:", error);
   
  }

    return new Response(
      JSON.stringify({ message: "Book added successfully" }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: "Failed to add book" }), {
      status: 500,
    });
  }
}