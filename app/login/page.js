'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/auth-context';
import PageLayout from '../../components/PageLayout.jsx';

export default function Login() {
  const router = useRouter();
  const { login, currentUser } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  // Set isClient to true once component mounts (client-side only)
  useEffect(() => {
    setIsClient(true);
    
    // If user is already logged in, redirect to home
    if (currentUser) {
      router.push('/');
    }
  }, [currentUser, router]);
  
  // Don't render anything meaningful during SSR or static export
  if (!isClient) {
    return (
      <PageLayout>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <div>
              <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Loading...
              </h2>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      router.push('/');
    } catch (err) {
      setError('Failed to sign in. Please check your credentials.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <PageLayout>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Sign in to your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Or{' '}
              <Link href="/signup" className="font-medium text-primary-600 hover:text-primary-500">
                create a new account
              </Link>
            </p>
          </div>
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
            
            <div className="text-center">
              <Link href="/forgot-password" className="font-medium text-primary-600 hover:text-primary-500">
                Forgot your password?
              </Link>
            </div>
            
            <div className="text-center">
              <Link href="/restaurant-signup" className="font-medium text-primary-600 hover:text-primary-500">
                Add Your Restaurant
              </Link>
            </div>
          </form>
        </div>
      </div>
    </PageLayout>
  );
} 