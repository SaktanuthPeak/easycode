import React, { useState } from "react";
import {
  Menu,
  ChevronLeft,
  BookMinus,
  LaptopMinimal,
  Home,
  Package,
  Tickets,
  CircleHelp,
  BadgeHelp,
  User,
  Settings,
  School,
  LogOut,
} from "lucide-react";
import { Outlet, useNavigate } from "react-router-dom";

export default function NavbarAdmin() {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();
  const logout = () => {
    sessionStorage.clear();
    window.location.href = "/home-preview";
  };
  return (
    <div className="flex h-screen ">
      <Sidebar
        isOpen={isOpen}
        onLogout={logout}
        toggle={() => setIsOpen(!isOpen)}
        navigate={navigate}
      />
      <div
        className={`flex-1 transition-all duration-300 ${
          isOpen ? "ml-64" : "ml-20"
        } `}
      >
        <Outlet />
      </div>
    </div>
  );
}

function Sidebar({ isOpen, toggle, onLogout, navigate }) {
  return (
    <div
      className={`bg-gray-900 text-white transition-all duration-300 p-4
        ${isOpen ? "w-64" : "w-20"} 
        fixed h-screen top-0 left-0 overflow-y-auto `}
    >
      <nav className="flex flex-col space-y-4">
        {/* <NavItem
          icon={User}
          label="Profile"
          isOpen={isOpen}
          path="profile"
          navigate={navigate}
        /> */}
        <NavItem
          icon={LaptopMinimal}
          label="Dashboard"
          isOpen={isOpen}
          path="/dashboard"
          navigate={navigate}
        />
        <NavItem
          icon={Package}
          label="Order"
          isOpen={isOpen}
          path="/order"
          navigate={navigate}
        />
        <NavItem
          icon={BookMinus}
          label="Courses"
          isOpen={isOpen}
          path="/courses"
          navigate={navigate}
        />
        <NavItem
          icon={School}
          label="Teacher"
          isOpen={isOpen}
          path="/teacher"
          navigate={navigate}
        />
        <NavItem
          icon={Tickets}
          label="Coupons"
          isOpen={isOpen}
          path="/coupons"
          navigate={navigate}
        />
        <NavItem
          icon={BadgeHelp}
          label="Teacher Support"
          isOpen={isOpen}
          path="/teacher-support"
          navigate={navigate}
        />
        <NavItem
          icon={CircleHelp}
          label="Support"
          isOpen={isOpen}
          path="support"
          navigate={navigate}
        />
        <NavItem
          icon={LogOut}
          label="Logout"
          isOpen={isOpen}
          onClick={onLogout}
        />
      </nav>
      <div className="border-t mt-auto">
        <button
          onClick={toggle}
          aria-label="Toggle Sidebar"
          className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-700 cursor-pointer"
        >
          {isOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
        </button>
      </div>
    </div>
  );
}

function NavItem({ icon: Icon, label, isOpen, path, onClick, navigate }) {
  return (
    <button
      className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-700 cursor-pointer"
      onClick={() => (onClick ? onClick() : navigate(path))}
    >
      <Icon size={20} />
      {isOpen && <span className="text-base">{label}</span>}
    </button>
  );
}
