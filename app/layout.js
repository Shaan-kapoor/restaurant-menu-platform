import './globals.css'
import { Inter } from 'next/font/google'
import { AuthProvider } from '../lib/auth-context'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Restaurant Menu Platform',
  description: 'A platform for local restaurants to showcase their menus and for customers to place orders',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
} 