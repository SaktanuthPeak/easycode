import React, { useState } from "react";
import { Menu, ChevronLeft, Home, User, Settings } from "lucide-react";
import { Outlet, useNavigate } from "react-router-dom";

export default function NavbarAdmin() {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();
  const logout = () => {
    sessionStorage.clear();
    window.location.href = "/home-preview";
  };
  return (
    <div className="flex h-screen">
      <Sidebar
        isOpen={isOpen}
        onLogout={logout}
        toggle={() => setIsOpen(!isOpen)}
        navigate={navigate}
      />
      <Outlet />
    </div>
  );
}

function Sidebar({ isOpen, toggle, onLogout, navigate }) {
  return (
    <div
      className={`bg-gray-900 text-white transition-all duration-300 p-4 ${
        isOpen ? "w-64" : "w-20"
      }`}
    >
      <nav className="flex flex-col space-y-4">
        <NavItem
          icon={Home}
          label="Home"
          isOpen={isOpen}
          path="/admin-home"
          navigate={navigate}
        />
        <NavItem
          icon={User}
          label="Profile"
          isOpen={isOpen}
          path="/admin-home2"
          navigate={navigate}
        />
        <NavItem
          icon={Settings}
          label="Settings"
          isOpen={isOpen}
          path="/admin-home3"
          navigate={navigate}
        />
        <NavItem
          icon={Settings}
          label="Logout"
          isOpen={isOpen}
          onClick={onLogout}
        />
      </nav>
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={toggle}
          aria-label="Toggle Sidebar"
          className="mb-6 space-y-4 pl-1.5"
        >
          {isOpen ? <ChevronLeft size={24} /> : <Menu size={24} />}
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
      {isOpen && <span className="text-lg">{label}</span>}
    </button>
  );
}
