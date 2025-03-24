import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '../lib/auth-context';
import { Bars3Icon, XMarkIcon, ShoppingCartIcon, UserIcon } from '@heroicons/react/24/outline';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, userRole, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-primary-600">FoodFinder</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
                Home
              </Link>
              <Link href="/restaurants" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
                Restaurants
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {currentUser ? (
              <div className="flex items-center space-x-4">
                {userRole === 'restaurant_owner' && (
                  <Link href="/dashboard" className="text-sm font-medium text-gray-500 hover:text-gray-700">
                    Dashboard
                  </Link>
                )}
                <Link href="/orders" className="text-sm font-medium text-gray-500 hover:text-gray-700">
                  Orders
                </Link>
                <Link href="/cart" className="relative p-1 rounded-full text-gray-400 hover:text-gray-500">
                  <ShoppingCartIcon className="h-6 w-6" aria-hidden="true" />
                </Link>
                <div className="relative ml-3">
                  <div>
                    <Link href="/profile" className="flex items-center space-x-2 text-gray-500 hover:text-gray-700">
                      <UserIcon className="h-5 w-5" />
                      <span className="text-sm font-medium">{currentUser.displayName || 'Profile'}</span>
                    </Link>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="ml-2 px-3 py-1 rounded-md text-sm font-medium text-gray-500 hover:text-gray-700"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/login" className="text-sm font-medium text-gray-500 hover:text-gray-700">
                  Login
                </Link>
                <Link href="/signup" className="btn-primary text-sm">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="bg-white inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              aria-expanded="false"
            >
              <span className="sr-only">{isOpen ? 'Close menu' : 'Open menu'}</span>
              {isOpen ? (
                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link href="/" className="block pl-3 pr-4 py-2 text-base font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50">
              Home
            </Link>
            <Link href="/restaurants" className="block pl-3 pr-4 py-2 text-base font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50">
              Restaurants
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            {currentUser ? (
              <div>
                <div className="flex items-center px-4">
                  <div className="flex-shrink-0">
                    <UserIcon className="h-10 w-10 rounded-full bg-gray-100 p-2" />
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">{currentUser.displayName || 'User'}</div>
                    <div className="text-sm font-medium text-gray-500">{currentUser.email}</div>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  {userRole === 'restaurant_owner' && (
                    <Link href="/dashboard" className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50">
                      Dashboard
                    </Link>
                  )}
                  <Link href="/profile" className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50">
                    Profile
                  </Link>
                  <Link href="/orders" className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50">
                    Orders
                  </Link>
                  <Link href="/cart" className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50">
                    Cart
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-3 space-y-1">
                <Link href="/login" className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50">
                  Login
                </Link>
                <Link href="/signup" className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
} 