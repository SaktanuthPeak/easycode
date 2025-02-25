import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import logo from "./images/Logo2.png";
import { useMessageModal } from "./messageModal";
import { useState, useEffect } from "react";
import ax from "../conf/ax";
import Notification from './notification';

const navigation = [
  { name: "Home", path: "/client-home", current: true },
  { name: "All courses", path: "/client-home/all-courses", current: false },
  { name: "My learning", path: "/client-home/my-learning", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const dropdownVariants = {
  hidden: {
    opacity: 0,
    y: -10,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.95,
    transition: {
      duration: 0.15,
      ease: "easeIn"
    }
  }
};

export default function NavbarLogin() {
  const logout = () => {
    sessionStorage.clear();
    window.location.href = "/home-preview";
  };
  const navigate = useNavigate();
  const { openModal } = useMessageModal();
  const [notifications, setNotifications] = useState([]);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const fetchUser = await ax.get(`/users/me`);
        setUsername(fetchUser.data.username);
      } catch (error) {
        console.error("Error fetching username:", error);
      }
    };
    fetchUsername();
  }, []);

  const fetchNotifications = async () => {
    try {
      const fetchMessage = await ax.get(`/messages?filters[username][$eq]=${username}&populate=*`);
      setNotifications(fetchMessage.data.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
      setNotifications([]);
    }
  };
  const deleteNotification = async (documentId) => {
    try {
      await ax.delete(`messages/${documentId}`);
      setNotifications(notifications.filter((notification) => notification.documentId !== documentId));
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const handleOpenCart = () => {
    navigate("client-home/cart");
  };

  const handleOpenProfile = () => {
    navigate("/client-home/profile-page");
  };

  return (
    <Disclosure as="nav" className="bg-white-800">
      <div className="mx-auto max-w-1xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          {/* Mobile menu button */}
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
              <span className="sr-only">Open main menu</span>
              <Bars3Icon
                aria-hidden="true"
                className="block h-6 w-6 group-data-[open]:hidden"
              />
              <XMarkIcon
                aria-hidden="true"
                className="hidden h-6 w-6 group-data-[open]:block"
              />
            </DisclosureButton>
          </div>

          {/* Logo and navigation */}
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex shrink-0 items-center pr-5">
              <img alt="Your Company" src={logo} className="h-8 w-auto" />
            </div>
            <div className="flex shrink-0 items-center">
              <p className="text-black text-sm font-medium">EasyCode</p>
            </div>
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                {navigation.map((item) => (
                  <button
                    key={item.name}
                    aria-current={item.current ? "page" : undefined}
                    onClick={() => navigate(item.path)}
                    className={classNames(
                      (item.current = () =>
                        "text-black rounded-md px-3 py-2 text-sm font-medium")
                    )}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right side buttons */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {/* Cart button */}
            <button
              type="button"
              onClick={handleOpenCart}
              className="relative rounded-full bg-white p-1 text-black-400 hover:text-gray-1000 focus:outline-0 focus:ring-2 focus:ring-black mr-2"
            >
              <span className="sr-only">View cart</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                />
              </svg>
            </button>

            {/* Notification Component */}
            <Notification
              notifications={notifications}
              fetchNotifications={fetchNotifications}
              deleteNotification={deleteNotification}
            />

            {/* Profile dropdown */}
            <Menu as="div" className="relative ml-3">
              {({ open }) => (
                <>
                  <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                    <span className="sr-only">Open user menu</span>
                    <img
                      alt="User"
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      className="h-8 w-8 rounded-full"
                    />
                  </MenuButton>
                  <AnimatePresence>
                    {open && (
                      <motion.div
                        className="absolute right-0 z-10 mt-2 w-48 origin-top-right"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={dropdownVariants}
                      >
                        <MenuItems static className="rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none">
                          <MenuItem>
                            <button
                              onClick={handleOpenProfile}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Your Profile
                            </button>
                          </MenuItem>
                          <MenuItem>
                            <button
                              onClick={openModal}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Support
                            </button>
                          </MenuItem>
                          <MenuItem>
                            <button
                              onClick={logout}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Sign Out
                            </button>
                          </MenuItem>
                        </MenuItems>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}
            </Menu>
          </div>
        </div>
      </div>

      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pb-3 pt-2">
          {navigation.map((item) => (
            <DisclosureButton
              key={item.name}
              as="a"
              href={item.href}
              aria-current={item.current ? "page" : undefined}
              className={classNames(
                item.current
                  ? "bg-gray-900 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white",
                "block rounded-md px-3 py-2 text-base font-medium"
              )}
            >
              {item.name}
            </DisclosureButton>
          ))}
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}