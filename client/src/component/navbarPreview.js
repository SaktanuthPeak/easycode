import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import logo from "./images/Logo2.png";

const navigation = [
  { name: "Home", path: "/clienthome", current: true },
  { name: "All courses", path: "/home-preview/all-courses", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function NavbarPreview({ onLogout }) {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };
  const handleSignUp = () => {
    navigate("/signup");
  };

  return (
    <Disclosure as="nav" className="bg-white">
      <div className="mx-auto max-w-10xl px-4 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          {/* Mobile Button */}
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <DisclosureButton className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
              <span className="sr-only">Open main menu</span>
              {/* Use conditional icons for open/close state */}
              {({ open }) => (open ? <XMarkIcon className="block h-6 w-6" /> : <Bars3Icon className="block h-6 w-6" />)}
            </DisclosureButton>
          </div>

          {/* Logo and Navigation (Centered on Small Screens) */}
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex shrink-0 items-center">
              <img alt="Your Company" src={logo} className="h-8 w-auto" />
              <p className="text-black text-sm font-medium pl-3">EasyCode</p>
            </div>
            {/* Navigation Links (Hidden on Small Screens) */}
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                {navigation.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => navigate(item.path)}
                    className={classNames(
                      item.current ? "text-black font-bold" : "text-gray-600 hover:text-black",
                      "rounded-md px-3 py-2 text-sm font-medium"
                    )}
                  >
                    {item.name}
                  </button>
                ))}
                {/* Search Bar (Hidden on Small Screens) */}

              </div>
            </div>
          </div>

          {/* Login/Signup Buttons */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <button
              className="outline outline-2 bg-white hover:bg-blue-600 text-black font-bold py-2 px-4 rounded-full h-10"
              onClick={handleLogin}
            >
              Login
            </button>
            <button
              className="ml-2 outline outline-2 bg-gray-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full h-10"
              onClick={handleSignUp}
            >
              Sign up
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pb-3 pt-2">
          {navigation.map((item) => (
            <DisclosureButton
              key={item.name}
              onClick={() => navigate(item.path)}
              className={classNames(
                item.current
                  ? "bg-gray-900 text-white"
                  : "text-gray-700 hover:bg-gray-100 hover:text-black",
                "block rounded-md px-3 py-2 text-base font-medium"
              )}
            >
              {item.name}
            </DisclosureButton>
          ))}
          {/* Mobile Search */}
          <div className="relative mt-2">
            <input
              type="text"
              placeholder="Search"
              className="border border-gray-300 rounded-md py-1 px-2 w-full"
            />
            <svg
              className="absolute right-2 h-6 w-6 text-gray-400 hover:text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}