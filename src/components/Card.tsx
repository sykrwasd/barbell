import React from "react";
import { Clock } from "lucide-react";

interface Customer {
  _id: string;
  name: string;
  status: string;
  service: string;
  date_book: string;
  time_book: string;
  price: number;
  remarks?: string;
  phone_number: string;
  payment?: string; // 🔹 Added new field
}

interface CustomerCardProps {
  customer: Customer;
  handleStatusChange: (id: string, newStatus: string) => void;
}

function CustomerCard({ customer, handleStatusChange }: CustomerCardProps) {
  return (
    <button
      key={customer._id}
      className="w-full bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-300"
    >
      {/* 🔹 Header: Name + Status */}
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold text-white">{customer.name}</h4>

        <select
          value={customer.status}
          onChange={(e) => handleStatusChange(customer._id, e.target.value)}
          className={`px-2 py-1 rounded-md text-sm font-medium border focus:outline-none ${
            customer.status === "pending"
              ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
              : customer.status === "Confirmed"
              ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
              : customer.status === "Completed"
              ? "bg-green-500/20 text-green-400 border-green-500/30"
              : "bg-red-500/20 text-red-400 border-red-500/30"
          }`}
        >
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="canceled">Canceled</option>
        </select>
      </div>

      {/* 🔹 Service + Date/Time + Price */}
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

      {/* 🔹 Remarks (if any) */}
      {customer.remarks && (
        <div className="text-left mt-1">
          <p className="text-white text-sm font-semibold">Request:</p>
          <p className="text-gray-300 text-sm mt-1">{customer.remarks}</p>
        </div>
      )}

      <div className="text-left mt-2">
        <p className="text-white text-sm font-semibold">Payment Method:</p>
        <p className="text-white text-sm mt-1">{customer.payment}</p>
      </div>

      {/* 🔹 Phone */}
      <div className="text-right mt-2">
        <p className="text-gray-400 text-sm">Phone: {customer.phone_number}</p>
      </div>
    </button>
  );
}

export default CustomerCard;
