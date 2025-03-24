'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

const AuthContext = createContext();

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

export function useAuth() {
  const context = useContext(AuthContext);
  
  // For static builds or SSR, return a placeholder when not in browser
  if (!isBrowser || !context) {
    return {
      currentUser: null,
      userRole: null,
      signup: () => Promise.resolve(null),
      login: () => Promise.resolve(null),
      logout: () => Promise.resolve(),
      loading: false
    };
  }
  
  return context;
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [isClient, setIsClient] = useState(false);

  async function signup(email, password, name, role = 'customer') {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update the user profile with the name
      await updateProfile(user, { displayName: name });
      
      // Create a user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        userId: user.uid,
        email: email,
        name: name,
        role: role,
        created: serverTimestamp(),
        lastLogin: serverTimestamp(),
        pointsEarned: 0,
        ordersCompleted: 0,
        currentTier: 'bronze'
      });
      
      // Add custom claims (role will be stored in user metadata)
      // In a real app, you'd use Firebase Functions to set custom claims
      // For simplicity, we'll store it in local storage for now
      localStorage.setItem('userRole', role);
      
      return user;
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    return signOut(auth);
  }

  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  async function getUserRole(uid) {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUserRole(userData.role);
        return userData.role;
      }
      return null;
    } catch (error) {
      console.error('Error fetching user role:', error);
      return null;
    }
  }

  useEffect(() => {
    // Set isClient to true as soon as this effect runs (only happens on the client)
    setIsClient(true);
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await getUserRole(user.uid);
      } else {
        setUserRole(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userRole,
    signup,
    login,
    logout,
    resetPassword,
    getUserRole,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {(!loading || !isClient) && children}
    </AuthContext.Provider>
  );
}

export default AuthProvider; 