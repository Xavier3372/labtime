'use client';

import { useState } from 'react';
import Link from 'next/link';

export default  function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleAccountMenu = () => {
    setIsAccountOpen(!isAccountOpen);
  };

  return (
    <nav className="linear-gradient(90deg, #1a1a2e 0%, #16213e 100%) shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link href="/" className="text-white hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">
              Home
            </Link>
            <Link href="/book" className="text-white hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">
              Book
            </Link>
            <Link href="/status" className="text-white hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">
              Status
            </Link>
            <Link href="/mybookings" className="text-white hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">
              My Bookings
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/"
              className="text-white hover:text-blue-600 hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium"
            >
              Home
            </Link>
            <Link
              href="/book"
              className="text-white hover:text-blue-600 hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium"
            >
              Book
            </Link>
            <Link
              href="/status"
              className="text-white hover:text-blue-600 hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium"
            >
              Status
            </Link>
            <Link
              href="/mybookings"
              className="text-white hover:text-blue-600 hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium"
            >
              My Bookings
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}