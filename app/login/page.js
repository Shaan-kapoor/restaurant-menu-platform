'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/auth-context';
import PageLayout from '../../components/PageLayout';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      setError('');
      setLoading(true);
      await login(email, password);
      router.push('/');
    } catch (err) {
      console.error('Login error:', err);
      setError('Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageLayout>
      <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
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
                  className="input-field rounded-t-md rounded-b-none"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  className="input-field rounded-b-md rounded-t-none"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link href="/forgot-password" className="font-medium text-primary-600 hover:text-primary-500">
                  Forgot your password?
                </Link>
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3">
              <button
                type="button"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.545,12.151L12.545,12.151c0,1.054,0.855,1.909,1.909,1.909h3.536c-0.229,1.196-0.666,2.307-1.278,3.279 c-0.613,0.971-1.411,1.843-2.394,2.615c-0.298,0.235-0.352,0.666-0.117,0.964c0.235,0.298,0.666,0.352,0.964,0.117 c2.248-1.762,3.838-4.229,4.339-7.043h1.431c0.344,0,0.624-0.28,0.624-0.624s-0.28-0.624-0.624-0.624h-1.437 c-0.098-0.54-0.232-1.064-0.401-1.569h1.839c0.344,0,0.624-0.28,0.624-0.624s-0.28-0.624-0.624-0.624h-2.451 c-0.661-1.379-1.585-2.616-2.717-3.699c-0.289-0.276-0.729-0.266-1.006,0.023c-0.276,0.289-0.266,0.729,0.023,1.006 c1.109,1.062,1.989,2.256,2.599,3.559c0.166,0.353,0.313,0.716,0.442,1.085H12.545c-0.366,0-0.664,0.298-0.664,0.664 C11.881,11.853,12.179,12.151,12.545,12.151z M21.662,9.758c-0.762-2.67-2.339-4.975-4.463-6.563 c-2.123-1.588-4.727-2.47-7.386-2.47c-3.073,0-5.928,1.135-8.111,3.012C1.871,3.689,1.871,4.129,2.154,4.418 C2.438,4.707,2.878,4.707,3.167,4.423c1.979-1.699,4.512-2.686,7.208-2.686c4.894,0,9.154,3.095,10.768,7.559 c0.107,0.297,0.428,0.45,0.725,0.343C22.165,9.532,22.318,9.211,21.662,9.758z M3.123,17.297 c-0.304,0.259-0.341,0.717-0.082,1.022c1.77,2.078,4.319,3.345,7.143,3.345c2.889,0,5.553-1.176,7.47-3.217 c0.267-0.284,0.254-0.73-0.03-0.997c-0.284-0.267-0.73-0.254-0.997,0.03c-1.671,1.784-4.015,2.801-6.444,2.801 c-2.519,0-4.798-1.143-6.339-2.954C3.886,17.074,3.428,17.038,3.123,17.297z"></path>
                </svg>
                <span>Google</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
} 