"use client";

import React, { useState } from 'react';
import { Calendar, Clock, User, DollarSign, TrendingUp, Scissors, Bell, Plus, X, Check } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const BarbellAdmin = () => {
  const [selectedView, setSelectedView] = useState('dashboard');
  const [availableDates, setAvailableDates] = useState([
    '2025-09-01', '2025-09-02', '2025-09-03', '2025-09-05', '2025-09-06',
    '2025-09-09', '2025-09-10', '2025-09-12', '2025-09-13', '2025-09-16'
  ]);
  const [selectedDateToToggle, setSelectedDateToToggle] = useState(null);

  // Mock data for upcoming appointments
  const upcomingCuts = [
    { id: 1, client: 'John Smith', service: 'Classic Cut', time: '9:00 AM', date: 'Today', price: 35, status: 'confirmed' },
    { id: 2, client: 'Mike Johnson', service: 'Full Service', time: '10:30 AM', date: 'Today', price: 55, status: 'confirmed' },
    { id: 3, client: 'David Brown', service: 'Beard Trim', time: '2:00 PM', date: 'Today', price: 25, status: 'pending' },
    { id: 4, client: 'Alex Wilson', service: 'Classic Cut', time: '9:30 AM', date: 'Tomorrow', price: 35, status: 'confirmed' },
    { id: 5, client: 'Chris Davis', service: 'Full Service', time: '11:00 AM', date: 'Tomorrow', price: 55, status: 'confirmed' },
    { id: 6, client: 'Ryan Miller', service: 'Classic Cut', time: '3:30 PM', date: 'Sep 2', price: 35, status: 'confirmed' },
  ];

  // Mock data for monthly sales
  const monthlySales = [
    { month: 'Jan', sales: 4200, appointments: 120 },
    { month: 'Feb', sales: 3800, appointments: 108 },
    { month: 'Mar', sales: 5100, appointments: 145 },
    { month: 'Apr', sales: 4600, appointments: 131 },
    { month: 'May', sales: 5400, appointments: 154 },
    { month: 'Jun', sales: 6200, appointments: 177 },
    { month: 'Jul', sales: 5800, appointments: 165 },
    { month: 'Aug', sales: 6500, appointments: 186 },
  ];

  const totalRevenue = monthlySales.reduce((sum, month) => sum + month.sales, 0);
  const totalAppointments = monthlySales.reduce((sum, month) => sum + month.appointments, 0);
  const avgPerCut = Math.round(totalRevenue / totalAppointments);

  // Calendar functions for availability management
  const generateCalendarDays = () => {
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
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      days.push({ day, dateStr, isAvailable: availableDates.includes(dateStr) });
    }
    
    return days;
  };

const toggleDateAvailability = (dateStr: string, day: number) => {
  const today = new Date();
  const selectedDate = new Date(dateStr);

  // Normalize today to midnight
  const todayMidnight = today.setHours(0, 0, 0, 0);

  // Compare timestamps (both numbers now)
  if (selectedDate.getTime() < todayMidnight) return;

  if (availableDates.includes(dateStr)) {
    setAvailableDates(availableDates.filter(date => date !== dateStr));
  } else {
    setAvailableDates([...availableDates, dateStr].sort());
  }
};


  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentMonth = monthNames[new Date().getMonth()];
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-black/80 backdrop-blur-xl border-b border-white/10 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-bold text-white tracking-tight">BARBELL</h1>
              <span className="text-sm text-gray-400 bg-white/10 px-3 py-1 rounded-full">Admin Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
              </button>
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
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
                  <p className="text-gray-400 text-sm">Todays Revenue</p>
                  <p className="text-2xl font-bold text-white">$115</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-400" />
              </div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">This Month</p>
                  <p className="text-2xl font-bold text-white">$6,500</p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-400" />
              </div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Appointments</p>
                  <p className="text-2xl font-bold text-white">186</p>
                </div>
                <Scissors className="w-8 h-8 text-purple-400" />
              </div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Avg per Cut</p>
                  <p className="text-2xl font-bold text-white">${avgPerCut}</p>
                </div>
                <User className="w-8 h-8 text-orange-400" />
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Upcoming Appointments */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
                <Calendar className="w-6 h-6" />
                Upcoming Cuts
              </h3>
              
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {upcomingCuts.map(cut => (
                  <div key={cut.id} className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-300">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-white">{cut.client}</h4>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        cut.status === 'confirmed' 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {cut.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="text-gray-400">
                        <p>{cut.service}</p>
                        <p className="flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3" />
                          {cut.date} • {cut.time}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-semibold">${cut.price}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="w-full mt-4 bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-medium transition-all duration-300">
                View All Appointments
              </button>
            </div>

            {/* Date Availability Management */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
                <Plus className="w-6 h-6" />
                Manage Availability
              </h3>
              
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-medium text-white">{currentMonth} {currentYear}</h4>
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
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                    <div key={day} className="py-2 font-medium">{day}</div>
                  ))}
                </div>
                
                <div className="grid grid-cols-7 gap-1">
                  {generateCalendarDays().map((dayObj, index) => {
                    if (!dayObj) return <div key={index} className="h-10"></div>;
                    
                    const { day, dateStr, isAvailable } = dayObj;
                    const isPast = new Date(dateStr).getTime() < new Date().setHours(0, 0, 0, 0);

                    
                    return (
                      <button
                        key={index}
                        onClick={() => !isPast && toggleDateAvailability(dateStr, day)}
                        disabled={isPast}
                        className={`
                          h-10 rounded-lg font-medium transition-all duration-300 text-sm
                          ${isPast 
                            ? 'text-gray-600 cursor-not-allowed' 
                            : 'cursor-pointer hover:scale-105'
                          }
                          ${isAvailable && !isPast
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                            : !isPast 
                            ? 'bg-gray-600/20 text-gray-400 hover:bg-gray-600/30'
                            : 'bg-gray-800/20 text-gray-600'
                          }
                        `}
                      >
                        {day}
                        {isAvailable && !isPast && (
                          <Check className="w-3 h-3 mx-auto mt-0.5" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
              
              <div className="space-y-3">
                <button className="w-full bg-green-500/20 hover:bg-green-500/30 text-green-400 py-3 rounded-xl font-medium transition-all duration-300 border border-green-500/30">
                  Open All Weekdays
                </button>
                <button className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-400 py-3 rounded-xl font-medium transition-all duration-300 border border-red-500/30">
                  Close All Days
                </button>
              </div>
            </div>

            {/* Monthly Sales Chart */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
                <TrendingUp className="w-6 h-6" />
                Monthly Sales
              </h3>
              
              <div className="mb-6">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlySales}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis 
                      dataKey="month" 
                      stroke="#9CA3AF"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="#9CA3AF"
                      fontSize={12}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        color: '#ffffff'
                      }}
                      formatter={(value, name) => [`$${value}`, 'Sales']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="sales" 
                      stroke="#3B82F6" 
                      strokeWidth={3}
                      dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Sales Summary */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-lg p-4 text-center">
                  <p className="text-gray-400 text-sm">Total Revenue</p>
                  <p className="text-xl font-bold text-white">${totalRevenue.toLocaleString()}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4 text-center">
                  <p className="text-gray-400 text-sm">Growth Rate</p>
                  <p className="text-xl font-bold text-green-400">+12.1%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Appointments Bar Chart */}
          <div className="mt-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
              <Scissors className="w-6 h-6" />
              Monthly Appointments
            </h3>
            
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlySales}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="month" 
                  stroke="#9CA3AF"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: '#ffffff'
                  }}
                  formatter={(value, name) => [`${value}`, 'Appointments']}
                />
                <Bar 
                  dataKey="appointments" 
                  fill="url(#barGradient)"
                  radius={[4, 4, 0, 0]}
                />
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#3B82F6" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 grid md:grid-cols-3 gap-6 mb-8">
            <button className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-6 text-left transition-all duration-300 group">
              <Calendar className="w-8 h-8 text-blue-400 mb-3 group-hover:scale-110 transition-transform" />
              <h4 className="text-lg font-semibold text-white mb-2">Schedule Appointment</h4>
              <p className="text-gray-400 text-sm">Add new booking for walk-ins</p>
            </button>
            
            <button className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-6 text-left transition-all duration-300 group">
              <User className="w-8 h-8 text-green-400 mb-3 group-hover:scale-110 transition-transform" />
              <h4 className="text-lg font-semibold text-white mb-2">Client Management</h4>
              <p className="text-gray-400 text-sm">View and manage client profiles</p>
            </button>
            
            <button className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-6 text-left transition-all duration-300 group">
              <DollarSign className="w-8 h-8 text-yellow-400 mb-3 group-hover:scale-110 transition-transform" />
              <h4 className="text-lg font-semibold text-white mb-2">Payment Processing</h4>
              <p className="text-gray-400 text-sm">Handle payments and invoices</p>
            </button>
          </div>
        </div>
      </div>
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

export default BarbellAdmin;