"use client";

import React, { useState } from "react";
import { Calendar, Clock, User, Menu, X } from "lucide-react";
import Image from "next/image";

const BarbellLanding = () => {
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

    // Add empty cells for days before month starts
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const timeSlots = [
    "9:00 AM",
    "9:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "12:30 PM",
    "1:00 PM",
    "1:30 PM",
    "2:00 PM",
    "2:30 PM",
    "3:00 PM",
    "3:30 PM",
    "4:00 PM",
    "4:30 PM",
    "5:00 PM",
    "5:30 PM",
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


            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              
              <button className="bg-white text-black px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300 hover:cursor-pointer" 
              onClick={ () => {window.location.href = "/login";}}>
                Login
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-white hover:text-gray-300 transition-colors"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-black/95 border-t border-white/10">
            <div className="px-4 pt-4 pb-6 space-y-4">
              
              <button className="w-full bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                onClick={ () => {window.location.href = "/login";}}>
                Login
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
            Book Your Cut
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
                            ? "bg-white text-black font-bold"
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

                  <button className="w-full bg-white text-black py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105">
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
