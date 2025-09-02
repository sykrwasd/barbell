"use client";

import React, { useEffect, useState } from "react";
import { Calendar, Clock, User, Menu, X } from "lucide-react";
import Image from "next/image";
import Swal from "sweetalert2";



type AvailableDate = {
  _id: string;
  dateStr: string;
  isOpen: boolean;
};

const BarbellLanding = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [remark, setRemark] = useState("");
  const [service, setService] = useState("");
  const [date, setDate] = useState<AvailableDate[]>([]); // empty object array
  const [customer, setCustomer] = useState<any | null>(null); //empty object
  const [showReceipt, setShowReceipt] = useState(false)

  useEffect(() => {
    fetchDate();
  }, []);

  async function fetchDate() {
    try {
      const res = await fetch("/api/getDate");
      const data = await res.json();

      const formatted = data.map((d: any) => ({
        dateStr: new Date(d.date).toISOString().split("T")[0],
        isOpen: d.isOpen,
      }));

      setDate(formatted);
      console.log(formatted);
    } catch (e) {
      console.error("Error fetching items:", e);
    }
  }

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault(); // prevent page reload if inside a <form>

    const formattedDate = selectedDate?.toISOString().split("T")[0];

    if (!name || !phone || !service) {
      return alert("Please complete the form");
    }


    // alert(
    //   `Name: ${name}\nPhone: ${phone}\nService: ${service}\nRemark: ${remark}\nSelected Time:${selectedTime}\nSelected Date: ${formattedDate}`
    // );
    try {
      const response = await fetch("/api/addBook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          phone_number: phone,
          service,
          remarks: remark,
          date_book: formattedDate,
          time_book: selectedTime,
        }),
      });

      if (response.ok) {
        console.log("Book added successfully");
        const data = {
          name,
          phone_number: phone,
          service,
          remarks: remark,
          date_book: formattedDate,
          time_book: selectedTime,
        };

        setCustomer(data);
        setShowReceipt(true)
        // Swal.fire({
        //   title: "Book Added Successfully!",
        //   icon: "success",
        // });
      } else {
        console.error("Failed to add book");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setName("");
      setPhone("");
      setRemark("");
      setService("");
      setSelectedDate(null);
      setSelectedTime("");
    }
  };

  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];
  const currentMonthIndex = now.getMonth();

  // Generate calendar days for current month
  // Calendar functions
  const generateCalendar = () => {
    const year = currentYear; // Get the current year
    const month = currentMonthIndex; // (0-11), 8-September

    const firstDay = new Date(year, month, 1); // 1st of month
    const lastDay = new Date(year, month + 1, 0); // last day of month
    const daysInMonth = lastDay.getDate(); // number of days in a month
    const startDay = firstDay.getDay(); // weekdays of the 1st (sun = 0, mon = 1, ... sat =6)
    //console.log("Start Day", startDay ) // output: 1 sebab september 1st is monday

    const days: (null | {
      day: number;
      dateStr: string;
      isAvailable: boolean;
    })[] = []; // empty arraylist

    // fill empty slots so thta the calendar align properly
    for (let i = 0; i < startDay; i++) days.push(null);

    //loop over every days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
        day
      ).padStart(2, "0")}`;
      //console.log(dateStr) // 2025-09-24, format date

      // check from DB state "date"
      const dbEntry = date.find((d) => d.dateStr === dateStr); // match the database data to the array

      days.push({
        day,
        dateStr,
        isAvailable: dbEntry ? dbEntry.isOpen : false, // default closed
      });
    }

    return days;
  };

  const timeSlots = [
    "12:00 AM",
    "1:00 AM",
    "2:00 AM",
    "3:00 AM",
    "4:00 AM",
    "5:00 AM",
    "6:00 AM",
    "7:00 AM",
    "8:00 AM",
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
    "5:00 PM",
    "6:00 PM",
    "7:00 PM",
    "8:00 PM",
    "9:00 PM",
    "10:00 PM",
    "11:00 PM",
  ];

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const currentMonth = monthNames[new Date().getMonth()];
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-500 via-black to-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-black/80 backdrop-blur-xl border-b border-white/10 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <Image
                  src="/img/logo.png"
                  alt="Barbell Logo"
                  width={64}
                  height={64}
                />
                BARBELL
              </h1>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-black/95 border-t border-white/10">
            <div className="px-4 pt-4 pb-6 space-y-4"></div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text">
            💈Book Your Cut
          </h2>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Premium grooming experience. Select your preferred date and time
            below.
          </p>
        </div>
      </section>

      {/* Booking Calendar Section */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Calendar */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-semibold text-white flex items-center gap-2">
                    <Calendar className="w-6 h-6" />
                    {currentMonth} {currentYear}
                  </h3>
                </div>

                <div className="grid grid-cols-7 gap-2 mb-4">
                  {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                    <div
                      key={day}
                      className="text-center text-gray-400 font-medium py-2"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {generateCalendar().map((day, index) => {
                    if (!day) return <div key={index} className="invisible" />;

                    const dbEntry = date.find((d) => d.dateStr === day.dateStr);
                    const isAvailable = dbEntry ? dbEntry.isOpen : false;
                    const isPast = new Date(day.dateStr) < new Date(todayStr); // only date comparison
                    const isSelected =
                      selectedDate?.toISOString().split("T")[0] === day.dateStr;

                    return (
                      <button
                        key={index}
                        onClick={() =>
                          isAvailable &&
                          !isPast &&
                          setSelectedDate(new Date(day.dateStr))
                        }
                        disabled={!isAvailable || isPast}
                        className={`
                        h-12 rounded-lg font-medium transition-all duration-300
                        ${
                          !isAvailable || isPast
                            ? "text-white cursor-not-allowed"
                            : "bg-green-500/20 text-green-400 border border-green-500/30"
                        }
                        ${isSelected ? "bg-gray-500 text-black font-bold" : ""}
                      `}
                      >
                        {day.day}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Selection */}
              <div>
                <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
                  <Clock className="w-6 h-6" />
                  Available Times
                </h3>

                {selectedDate ? (
                  <div className="grid grid-cols-2 gap-3">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`
                          p-3 rounded-lg font-medium transition-all duration-300
                          ${
                            selectedTime === time
                              ? "bg-white text-black font-bold"
                              : "bg-white/10 text-white hover:bg-white/20"
                          }
                        `}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Please select a date first</p>
                  </div>
                )}
              </div>
            </div>

            {/* Booking Summary & CTA */}
            {selectedDate && selectedTime && (
              <div className="mt-8 pt-8 border-t border-white/10">
                <div className="bg-white/10 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-2">
                        Booking Summary
                      </h4>
                      <p className="text-gray-300">
                        {currentMonth} {selectedDate.toDateString()},{" "}
                        {currentYear} at {selectedTime}
                      </p>
                    </div>
                    <User className="w-8 h-8 text-gray-400" />
                  </div>

                  <form method="dialog" className="space-y-6">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-bold text-white uppercase tracking-wide mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm text-gray-800 placeholder-gray-500"
                        placeholder="Your Name"
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-white uppercase tracking-wide mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm text-gray-800 placeholder-gray-500"
                        placeholder="e.g. 012-3456789"
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>

                    {/* Service Selection */}
                    <div>
                      <label className="block text-sm font-bold text-white uppercase tracking-wide mb-2">
                        Service
                      </label>
                      <select
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm text-gray-800"
                        onChange={(e) => setService(e.target.value)}
                      >
                        <option value="">Select a service</option>
                        <option value="Haircut">Haircut - RM20</option>
                        <option value="Beard-trim">Beard Trim - RM0-RM5</option>
                        <option value="Hair-colour">Hair Colour - RM30</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-white uppercase tracking-wide mb-2">
                        Special Remarks / Requests
                      </label>
                      <textarea
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm text-gray-800 placeholder-gray-500"
                        placeholder="Any special requests..."
                        onChange={(e) => setRemark(e.target.value)}
                      ></textarea>
                    </div>
                  </form>

                  <button
                    className="w-full bg-white text-black py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 mt-4"
                    onClick={handleBook}
                  >
                    Book Appointment
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-white mb-12">
            Our Services
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Haircut", price: "RM20", duration: "30 mins" },
              { name: "Beard Trim", price: "RM0 – RM5", duration: "20 mins" },
              { name: "Hair Colour", price: "RM30", duration: "2 hours" },
            ].map((service, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 text-center hover:bg-white/10 transition-all duration-300"
              >
                <h4 className="text-xl font-semibold text-white mb-2">
                  {service.name}
                </h4>
                <p className="text-gray-400 mb-4">{service.duration}</p>
                <p className="text-2xl font-bold text-white">{service.price}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Qr Code */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-white mb-6">Pay Easily</h3>
          <p className="text-gray-400 mb-6">
            Transfer to{" "}
            <span className="font-semibold text-white">1651 2546 2179</span>{" "}
            (Bank) and show proof to our barber.
          </p>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
            <img
              src="/img/qrCode.jpg"
              alt="QR Code"
              className="mx-auto h-[40rem] object-contain rounded-lg shadow-lg"
            />
            <p className="mt-4 text-gray-400">Scan to Pay</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">BARBELL</h3>
          <p className="text-gray-400 mb-6">
            Premium grooming for the modern gentleman
          </p>
        </div>
      </footer>

      {showReceipt && customer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-[90%] max-w-md p-6 relative">
            {/* Close button */}
            <button
              onClick={() => setShowReceipt(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black"
            >
              ✕
            </button>

            {/* Receipt Content */}
            <h2 className="text-2xl font-bold text-black   text-center mb-4">
              💈 Booking Receipt
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>
                <span className="font-semibold">Name:</span> {customer.name}
              </p>
              <p>
                <span className="font-semibold">Phone:</span>{" "}
                {customer.phone_number}
              </p>
              <p>
                <span className="font-semibold">Service:</span>{" "}
                {customer.service}
              </p>
              <p>
                <span className="font-semibold">Remarks:</span>{" "}
                {customer.remarks || "-"}
              </p>
              <p>
                <span className="font-semibold">Date:</span> {customer.date_book}
              </p>
              <p>
                <span className="font-semibold">Time:</span> {customer.time_book}
              </p>
            </div>

            {/* Screenshot Hint */}
            <div className="mt-6 text-center">
              <p className="text-gray-500 text-sm">
                📸 Screenshot this receipt as proof of booking
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BarbellLanding;
