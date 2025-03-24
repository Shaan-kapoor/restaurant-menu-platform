import Navigation from './Navigation';
import Footer from './Footer';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Import auth components with dynamic imports to prevent them from being included in the static build
const AuthProvider = dynamic(
  () => import('../lib/auth-context').then(mod => mod.AuthProvider),
  { ssr: false, loading: () => null }
);

export default function PageLayout({ children }) {
  const [isClient, setIsClient] = useState(false);

  // Only run this effect on the client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // For server-side rendering or static generation, return a simplified layout
  if (!isClient) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="h-16 bg-primary-500"></div>
        <main className="flex-grow flex justify-center items-center">
          <div className="spinner animate-spin h-12 w-12 border-t-4 border-primary-500 border-solid rounded-full"></div>
        </main>
        <div className="h-16 bg-gray-100"></div>
      </div>
    );
  }

  // On the client, use the full layout with AuthProvider
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen">
        <Navigation />
        <main className="flex-grow">{children}</main>
        <Footer />
      </div>
    </AuthProvider>
  );
} 