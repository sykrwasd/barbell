"use client";

import React, { useEffect, useState } from "react";
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

const BarbellAdmin = () => {
  const [cust, setCustomer] = useState<Customer[]>([]);
  const [showAllAppointments, setShowAllAppointments] = useState(false);

  useEffect(() => {
    fetchCustomer();
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

  const [availableDates, setAvailableDates] = useState([
    "2025-09-01",
    "2025-09-02",
    "2025-09-03",
    "2025-09-05",
    "2025-09-06",
    "2025-09-09",
    "2025-09-10",
    "2025-09-12",
    "2025-09-13",
    "2025-09-16",
  ]);

  const [selectedDateToToggle, setSelectedDateToToggle] = useState<
    string | null
  >(null);

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

  const totalRevenue = monthlyStats.reduce((sum, m) => sum + m.sales, 0);
  const totalAppointments = monthlyStats.reduce(
    (sum, m) => sum + m.appointments,
    0
  );
  const totalAppointmentsAllTime = cust.length;
      console.log(totalAppointmentsAllTime)

  // Calendar functions
  const generateCalendarDays = () => {
    const year = currentYear;
    const month = currentMonthIndex;
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDay = firstDay.getDay();

    const days: (null | {
      day: number;
      dateStr: string;
      isAvailable: boolean;
    })[] = [];

    for (let i = 0; i < startDay; i++) days.push(null);

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
        day
      ).padStart(2, "0")}`;
      days.push({
        day,
        dateStr,
        isAvailable: availableDates.includes(dateStr),
      });
    }

    return days;
  };

  const toggleDateAvailability = (dateStr: string) => {
    const todayMidnight = new Date().setHours(0, 0, 0, 0);
    const selectedDate = new Date(dateStr);
    if (selectedDate.getTime() < todayMidnight) return;

    setSelectedDateToToggle(dateStr);

    if (availableDates.includes(dateStr)) {
      setAvailableDates(availableDates.filter((d) => d !== dateStr));
    } else {
      setAvailableDates([...availableDates, dateStr].sort());
    }
  };

  const handleConfirm = () => {
    console.log("Available Dates:");
    console.log(availableDates);
  };

  const handleCloseAll = () => setAvailableDates([]);

  const handleUpdate = (c: Customer) => {
    // For future use
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
                    return (
                      <button
                        key={index}
                        onClick={() =>
                          !isPast && toggleDateAvailability(dateStr)
                        }
                        disabled={isPast}
                        className={`h-10 rounded-lg font-medium transition-all duration-300 text-sm ${
                          isPast
                            ? "text-gray-600 cursor-not-allowed"
                            : "cursor-pointer hover:scale-105"
                        } ${
                          isAvailable && !isPast
                            ? "bg-green-500/20 text-green-400 border border-green-500/30"
                            : !isPast
                            ? "bg-gray-600/20 text-gray-400 hover:bg-gray-600/30"
                            : "bg-gray-800/20 text-gray-600"
                        }`}
                      >
                        {day}{" "}
                        {isAvailable && !isPast && (
                          <Check className="w-3 h-3 mx-auto mt-0.5" />
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
                <button
                  className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-400 py-3 rounded-xl font-medium transition-all duration-300 border border-red-500/30"
                  onClick={handleCloseAll}
                >
                  Close All Days
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

            <div className="max-h-[70vh] overflow-y-auto space-y-4">
              {cust.map((customer) => (
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
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BarbellAdmin;
