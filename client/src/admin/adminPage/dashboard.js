"use client";

import { useState } from "react";
import {
  Bell,
  BookOpen,
  ChevronLeft,
  Home,
  LogOut,
  Menu,
  Settings,
  User,
  Users,
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const IncomeGraph = () => {
  const data = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Income",
        data: [1000, 1500, 1300, 1700, 2000, 1800],
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Monthly Income",
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen">
      <main className="flex-1 overflow-x-hidden overflow-y-auto p-4">
        <h1 className="text-2xl font-semibold mb-6">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white shadow rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4">User Statistics</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Total Users</span>
                  <span className="text-sm font-medium">1,234</span>
                </div>
                <div className="h-2 bg-gray-200 rounded w-full">
                  <div
                    className="h-2 bg-blue-500 rounded"
                    style={{ width: "80%" }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Active Users</span>
                  <span className="text-sm font-medium">987</span>
                </div>
                <div className="h-2 bg-gray-200 rounded w-full">
                  <div
                    className="h-2 bg-green-500 rounded"
                    style={{ width: "65%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-4 text-center">
            <h2 className="text-lg font-semibold mb-4">Total Teachers</h2>
            <div className="text-4xl font-bold">156</div>
            <p className="text-sm text-gray-500 mt-2">
              Active instructors on the platform
            </p>
          </div>

          <div className="bg-white shadow rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4">Course Overview</h2>
            <ul className="space-y-2">
              <li className="flex justify-between items-center">
                <span>Total Courses</span>
                <span className="font-semibold">50</span>
              </li>
              <li className="flex justify-between items-center">
                <span>Active Courses</span>
                <span className="font-semibold">35</span>
              </li>
              <li className="flex justify-between items-center">
                <span>Pending Review</span>
                <span className="font-semibold text-yellow-500">3</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-4 mt-6 ">
          <h2 className="text-lg font-semibold mb-4 ">Income Overview</h2>
          <IncomeGraph />
        </div>

        <div className="bg-white shadow rounded-lg p-4 mt-6">
          <h2 className="text-lg font-semibold mb-4">Recent Activities</h2>
          <ul className="space-y-2">
            <li className="flex justify-between items-center">
              <span>New user registration</span>
              <span className="text-sm text-gray-500">5 minutes ago</span>
            </li>
            <li className="flex justify-between items-center">
              <span>Course "Advanced React" published</span>
              <span className="text-sm text-gray-500">1 hour ago</span>
            </li>
            <li className="flex justify-between items-center">
              <span>User report generated</span>
              <span className="text-sm text-gray-500">3 hours ago</span>
            </li>
            <li className="flex justify-between items-center">
              <span>System update completed</span>
              <span className="text-sm text-gray-500">Yesterday</span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
