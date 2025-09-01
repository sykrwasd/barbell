"use client";

import React, { use, useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  User,
  DollarSign,
  TrendingUp,
  Scissors,
  Bell,
  Plus,
  X,
  Check,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

import { DataTableComponent } from "datatables.net-react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

type Customer = {
  _id: string;
  name: string;
  phone_number: string;
  service: string;
  remarks: string;
  date_book: string;
  time_book: string;
  price: number;
};

type Date = {
  _id: string;
  dateStr: string;
  isOpen: boolean;
};

const BarbellAdmin = () => {
  const router = useRouter();
  const [cust, setCustomer] = useState<Customer[]>([]);
  const [showAllAppointments, setShowAllAppointments] = useState(false);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  
  const [selectedDateToToggle, setSelectedDateToToggle] = useState<
   string | null
  >(null);
  const [isSelected, setIsSelected] = useState(false);
  const [date, setDate] = useState<Date[]>([]);
  const [password, setPassword] = useState("");


  useEffect(() => {
    fetchCustomer();
    fetchDate();
     (
      document.getElementById("passwordModal") as HTMLDialogElement
    )?.showModal();
  }, []);

  async function fetchCustomer() {
    try {
      const res = await fetch("/api/getCust");
      const data = await res.json();
      setCustomer(data);
      console.log(data);
    } catch (e) {
      console.error("Error fetching items:", e);
    }
  }

  //fetching every date in Database
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

  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];
  const currentMonthIndex = now.getMonth();
  const currentYear = now.getFullYear();
  const currentMonth = monthNames[currentMonthIndex];

  // Stats
  const todaysAppointments = cust.filter((c) => c.date_book === todayStr);
  const todaysRevenue = todaysAppointments.reduce((sum, c) => sum + c.price, 0);

  const thisMonthAppointments = cust.filter((c) => {
    const date = new Date(c.date_book);
    return (
      date.getMonth() === currentMonthIndex &&
      date.getFullYear() === currentYear
    );
  });
  const thisMonthRevenue = thisMonthAppointments.reduce(
    (sum, c) => sum + c.price,
    0
  );
  const appointmentsCount = thisMonthAppointments.length;

  // Monthly stats for charts
  const monthlyStats = Array.from({ length: 12 }, (_, i) => {
    const monthlyCust = cust.filter((c) => {
      const date = new Date(c.date_book);
      return date.getMonth() === i && date.getFullYear() === currentYear;
    });
    const sales = monthlyCust.reduce((sum, c) => sum + c.price, 0);
    const appointments = monthlyCust.length;
    return { month: monthNames[i], sales, appointments };
  });

  const totalAppointmentsAllTime = cust.length;
  //console.log(totalAppointmentsAllTime);

  const [searchQuery, setSearchQuery] = useState("");

const filteredCustomers = cust.filter((customer) =>
  customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  customer.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
  customer.phone_number.toLowerCase().includes(searchQuery.toLowerCase())
);

  const handlePassword = async () => {
    try {
      const res = await fetch(`/api/checkPassword`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        (
          document.getElementById("passwordModal") as HTMLDialogElement
        )?.close();

        Swal.fire({
          title: "Wrong Password, Redirecting..",
          icon: "error",
          confirmButtonText: "OK",
        });
        setTimeout(() => {
          router.push("/");
        }, 250);
      } else {
        (
          document.getElementById("passwordModal") as HTMLDialogElement
        )?.close();
        Swal.fire({
          title: "Admin Verified",
          icon: "success",
          confirmButtonText: "OK",
        });
      }
    } catch (e) {
      console.error(e);
    }
  };


  // Calendar functions
  const generateCalendarDays = () => {
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

  const toggleDateAvailability = async (dateStr: string) => {
    const todayMidnight = new Date().setHours(0, 0, 0, 0);
    const selectedDate = new Date(dateStr).toISOString().split("T")[0];

    setSelectedDateToToggle(selectedDate); // store selected date

    console.log("Selected date:", selectedDate);

    try {
      const response = await fetch("/api/toggleDate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ dateStr: selectedDate }),
      });
    } catch {}
  };

  const handleConfirm = async () => {
  await fetchDate();
  setSelectedDates([]); // clear selections
};


  const handleUpdate = (c: Customer) => {
    // For future use
  };

    const toggleSelect = (dateStr: string) => {
    setSelectedDates((prev) =>
      prev.includes(dateStr)
        ? prev.filter((d) => d !== dateStr) // unselect if already selected
        : [...prev, dateStr] // add if not selected
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-black/80 backdrop-blur-xl border-b border-white/10 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-bold text-white tracking-tight">
                BARBELL
              </h1>
              <span className="text-sm text-gray-400 bg-white/10 px-3 py-1 rounded-full">
                Admin Dashboard
              </span>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Today&apos;s Revenue</p>
                  <p className="text-2xl font-bold text-white">
                    RM {todaysRevenue}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-green-400" />
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">This Month</p>
                  <p className="text-2xl font-bold text-white">
                    RM {thisMonthRevenue}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-400" />
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">
                    This Month Appointments
                  </p>
                  <p className="text-2xl font-bold text-white">
                    {appointmentsCount}
                  </p>
                </div>
                <Scissors className="w-8 h-8 text-purple-400" />
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Appointments</p>
                  <p className="text-2xl font-bold text-white">
                    {totalAppointmentsAllTime}
                  </p>
                </div>
                <User className="w-8 h-8 text-orange-400" />
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Upcoming Appointments */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
                <Calendar className="w-6 h-6" /> Upcoming Cuts
              </h3>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {cust.map((customer) => (
                  <button
                    key={customer._id}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-300"
                    onClick={() => handleUpdate(customer)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-white">
                        {customer.name}
                      </h4>
                    </div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <div
                        className={`text-left text-sm font-medium mt-1 ${
                          {
                            Haircut: "text-yellow-400",
                            "Beard-trim": "text-green-400",
                            "Hair-colour": "text-purple-400",
                          }[customer.service] || "text-gray-400"
                        }`}
                      >
                        <p>{customer.service}</p>
                        <p className="flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3" /> {customer.date_book} •{" "}
                          {customer.time_book}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="px-3 py-1 rounded-full text-sm font-medium">
                          RM {customer.price}
                        </p>
                      </div>
                    </div>
                    {customer.remarks && (
                      <div className="text-left mt-1">
                        <p className="text-white text-sm font-semibold">
                          Request:
                        </p>
                        <p className="text-gray-300 text-sm mt-1">
                          {customer.remarks}
                        </p>
                      </div>
                    )}
                    <div className="text-right mt-2">
                      <p className="text-gray-400 text-sm">
                        Phone: {customer.phone_number}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
              <button
                className="w-full mt-4 bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-medium transition-all duration-300"
                onClick={() => setShowAllAppointments(true)}
              >
                View All Appointments
              </button>
            </div>

            {/* Date Availability */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
                <Plus className="w-6 h-6" /> Manage Availability
              </h3>
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-medium text-white">
                    {currentMonth} {currentYear}
                  </h4>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-gray-400">Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
                      <span className="text-gray-400">Closed</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-1 mb-2 text-center text-gray-400 text-sm">
                  {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                    <div key={d} className="py-2 font-medium">
                      {d}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {generateCalendarDays().map((dayObj, index) => {
                    if (!dayObj)
                      return <div key={index} className="h-10"></div>;
                    const { day, dateStr, isAvailable } = dayObj;
                    const isPast =
                      new Date(dateStr).getTime() <
                      new Date().setHours(0, 0, 0, 0);

                      const isSelected = selectedDates.includes(dateStr);

                    return (
                      <button
                        key={index}
                        onClick={() => {
                          if (!isPast) {
                            toggleDateAvailability(dateStr);
                            toggleSelect(dateStr);
                          }
                        }}
                        disabled={isPast}
                        className={`h-10 rounded-lg font-medium transition-all duration-300 text-sm
                      ${
                        isPast
                          ? "text-gray-600 cursor-not-allowed bg-gray-800/20"
                          : isSelected
                          ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                          : isAvailable
                          ? "bg-green-500/20 text-green-400 border border-green-500/30"
                          : "bg-gray-600/20 text-gray-400 hover:bg-gray-600/30 cursor-pointer hover:scale-105"
                      }`}
                      >
                        {day}
                        {isAvailable && !isPast && !isSelected && (
                          <Check className="w-3 h-3 mx-auto mt-0.5" />
                        )}
                        {isAvailable && !isPast && isSelected && (
                          <X className="w-3 h-3 mx-auto mt-0.5" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-3">
                <button
                  className="w-full bg-green-500/20 hover:bg-green-500/30 text-green-400 py-3 rounded-xl font-medium transition-all duration-300 border border-green-500/30"
                  onClick={handleConfirm}
                >
                  Confirm
                </button>
              </div>
            </div>

            {/* Monthly Sales Chart */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
                <Scissors className="w-6 h-6" /> Appointments
              </h3>

              <div className="w-full h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyStats}
                    margin={{ top: 10, right: 20, left: -10, bottom: 10 }}
                  >
                    <defs>
                      <linearGradient
                        id="barGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop offset="0%" stopColor="#8B5CF6" />
                        <stop offset="100%" stopColor="#3B82F6" />
                      </linearGradient>
                    </defs>

                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.1)"
                    />
                    <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} />
                    <YAxis stroke="#9CA3AF" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(0,0,0,0.8)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "8px",
                        color: "#ffffff",
                      }}
                      formatter={(value) => [value, "Appointments"]}
                    />
                    <Bar
                      dataKey="appointments"
                      fill="url(#barGradient)"
                      radius={[6, 6, 0, 0]}
                      barSize={20}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Appointments BarChart */}
            </div>
          </div>

          <div className="mb-8 mt-5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
              <TrendingUp className="w-6 h-6" /> Monthly Sales
            </h3>
            <div className="mb-6">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyStats}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.1)"
                  />
                  <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} />
                  <YAxis
                    stroke="#9CA3AF"
                    fontSize={12}
                    tickFormatter={(v) => `$${v}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(0,0,0,0.8)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "8px",
                      color: "#ffffff",
                    }}
                    formatter={(value) => [`RM${value}`, "Sales"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#3B82F6"
                    strokeWidth={3}
                    dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: "#3B82F6", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

     {showAllAppointments && (
  <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
    <div className="bg-gray-900 rounded-2xl w-full max-w-4xl p-6 relative">
      <button
        className="absolute top-4 right-4 text-gray-400 hover:text-white"
        onClick={() => setShowAllAppointments(false)}
      >
        <X className="w-6 h-6" />
      </button>

      <h2 className="text-2xl font-bold text-white mb-4">
        All Appointments
      </h2>

      {/* 🔍 Search Bar */}
      <input
        type="text"
        placeholder="Search by name, service, or phone..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full mb-4 p-2 rounded-lg bg-gray-800 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
      />

      {/* Filtered Appointments */}
      <div className="max-h-[70vh] overflow-y-auto space-y-4">
        {filteredCustomers.length > 0 ? (
          filteredCustomers.map((customer) => (
            <div
              key={customer._id}
              className="bg-white/5 border border-white/10 rounded-xl p-4"
            >
              <div className="flex justify-between items-center">
                <h4 className="text-white font-semibold">
                  {customer.name}
                </h4>
              </div>
              <div className="flex justify-between mt-2 text-sm">
                <div
                  className={`${
                    {
                      Haircut: "text-yellow-400",
                      "Beard-trim": "text-green-400",
                      "Hair-colour": "text-purple-400",
                    }[customer.service] || "text-gray-400"
                  }`}
                >
                  <p>{customer.service}</p>
                  <p className="flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3" />
                    {customer.date_book} • {customer.time_book}
                  </p>
                </div>
                <p className="text-right text-white font-medium">
                  RM {customer.price}
                </p>
              </div>
              {customer.remarks && (
                <p className="text-gray-300 text-sm mt-1">
                  Request: {customer.remarks}
                </p>
              )}
              <p className="text-gray-400 text-sm mt-1">
                Phone: {customer.phone_number}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-center">No results found</p>
        )}
      </div>
    </div>
  </div>
)}

    <dialog id="passwordModal" className="modal backdrop-brightness-0">
        <div className="modal-box bg-white ">
          <h3 className="font-bold text-lg text-black">
            Password are required to proceed.
          </h3>

          {/* Form Content */}
          <div className="mt-4">
            <label className="block text-sm font-bold text-gray-700 font-['Poppins',sans-serif] uppercase tracking-wide mb-2">
              Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm font-['Inter',sans-serif] text-gray-800 placeholder-gray-500"
              placeholder="Enter Password"
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="modal-action flex gap-3">
              <button
                type="button"
                className="btn btn-primary rounded-lg"
                onClick={handlePassword}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </dialog>

    </div>
  );
};

export default BarbellAdmin;