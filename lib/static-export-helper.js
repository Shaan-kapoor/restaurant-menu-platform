// This file contains static components and utilities for static export
// They avoid firebase imports and provide minimal functionality

export function NoopAuthProvider({ children }) {
  // Simple provider that wraps children without actual auth
  return <>{children}</>;
}

export const staticAuthValue = {
  currentUser: null,
  userRole: null,
  signup: () => Promise.resolve(null),
  login: () => Promise.resolve(null),
  logout: () => Promise.resolve(),
  resetPassword: () => Promise.resolve(),
  getUserRole: () => Promise.resolve(null),
  loading: false
}; 