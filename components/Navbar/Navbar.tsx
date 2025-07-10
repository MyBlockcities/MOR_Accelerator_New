import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import { DarkModeToggle } from "../common/DarkModeToggle";
import ImprovedConnectWallet from "../ConnectWallet/ImprovedConnectWallet";
import NetworkSwitcher from "../common/NetworkSwitcher";

export default function Navbar() {
  const router = useRouter();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const handleDropdownToggle = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const navItems = [
    { 
      name: "About", 
      href: "#",
      dropdownItems: [
        { name: "Learn MOR", href: "https://github.com/MorpheusAIs/Morpheus" },
        { name: "Documentation", href: "/docs" }
      ]
    },
    { name: "Builder Pools", href: "/builder-pools" },
    { name: "Stake", href: "/stake" },
    { name: "Rewards", href: "/rewards" },
    { name: "Profile", href: "/profile" },
    { name: "Builders", href: "/register" }
  ];

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 shadow-lg sticky top-0 z-50 backdrop-blur-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <motion.div 
              className="flex-shrink-0"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Link href="/" className="flex items-center">
                <Image 
                  src="/logo-white.png" 
                  alt="Morpheus Logo" 
                  width={120} 
                  height={30}
                  className="cursor-pointer"
                />
              </Link>
            </motion.div>
            <motion.div 
              className="hidden sm:ml-8 sm:flex sm:items-center sm:space-x-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {navItems.map((item, index) => (
                <motion.div 
                  key={item.name} 
                  className="relative inline-flex items-center"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                >
                  {item.dropdownItems ? (
                    <div>
                      <motion.button
                        onClick={() => handleDropdownToggle(item.name)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`${
                          openDropdown === item.name
                            ? 'border-[#00FF84] text-white'
                            : 'border-transparent text-gray-300 hover:text-white hover:border-[#00FF84]'
                        } inline-flex items-center px-3 py-2 border-b-2 text-sm font-medium transition-colors duration-200`}
                      >
                        {item.name}
                        <motion.svg 
                          className="ml-2 h-4 w-4" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                          animate={{ rotate: openDropdown === item.name ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </motion.svg>
                      </motion.button>
                      <AnimatePresence>
                        {openDropdown === item.name && (
                          <motion.div 
                            className="absolute z-10 mt-2 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5"
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="py-1">
                              {item.dropdownItems.map((dropdownItem, dropIndex) => (
                                <motion.div
                                  key={dropdownItem.name}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.2, delay: 0.05 * dropIndex }}
                                >
                                  <Link
                                    href={dropdownItem.href}
                                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-150"
                                  >
                                    {dropdownItem.name}
                                  </Link>
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        href={item.href}
                        className={`${
                          router.pathname === item.href
                            ? 'border-[#00FF84] text-white'
                            : 'border-transparent text-gray-300 hover:text-white hover:border-[#00FF84]'
                        } inline-flex items-center px-3 py-2 border-b-2 text-sm font-medium transition-colors duration-200`}
                      >
                        {item.name}
                      </Link>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </div>
          <motion.div 
            className="flex items-center space-x-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.2 }}
            >
              <NetworkSwitcher />
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.2 }}
            >
              <DarkModeToggle />
            </motion.div>
            <motion.div 
              className="relative z-50"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <ImprovedConnectWallet />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.nav>
  );
}