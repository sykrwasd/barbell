"use client";

import React, { useState } from "react";
import { Calendar, Clock, User, Menu, X } from "lucide-react";
import Image from "next/image";

const BarbellLanding = () => {
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [remark, setRemark] = useState("");
  const [service, setService] = useState("");

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault(); // prevent page reload if inside a <form>

    alert(
      `Name: ${name}\nPhone: ${phone}\nService: ${service}\nRemark: ${remark}`
    );

    setName("");
    setPhone("");
    setRemark("");
    setService("");
  };

  // Generate calendar days for current month
  const generateCalendar = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDay = firstDay.getDay();

    const days = [];

    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
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
                  {generateCalendar().map((day, index) => (
                    <button
                      key={index}
                      onClick={() => day && setSelectedDate(day)}
                      disabled={!day || day < new Date().getDate()}
                      className={`
                        h-12 rounded-lg font-medium transition-all duration-300
                        ${!day ? "invisible" : ""}
                        ${
                          day && day < new Date().getDate()
                            ? "text-gray-600 cursor-not-allowed"
                            : "text-white hover:bg-white/20 cursor-pointer"
                        }
                        ${
                          selectedDate === day
                            ? "bg-gray-500 text-black font-bold"
                            : "hover:bg-white/10"
                        }
                      `}
                    >
                      {day}
                    </button>
                  ))}
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
                        {currentMonth} {selectedDate}, {currentYear} at{" "}
                        {selectedTime}
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
                        <option value="haircut">Haircut - RM20</option>
                        <option value="beard-trim">Beard Trim - RM0-RM5</option>
                        <option value="hair-colour">Hair Colour - RM30</option>
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
              { name: "Haircut", price: "RM20", duration: "30 min" },
              { name: "Beard Trim", price: "RM0 – RM5", duration: "20 min" },
              { name: "Hair Colour", price: "RM30", duration: "45 min" },
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

        
      

    </div>
  );
};

export default BarbellLanding;
