import Navigation from './Navigation';
import Footer from './Footer';
import { AuthProvider } from '../lib/auth-context';

export default function PageLayout({ children }) {
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