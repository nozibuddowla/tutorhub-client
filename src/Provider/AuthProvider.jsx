import React, { createContext, useEffect, useState } from "react";
import auth from "../firebase/firebase.config";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import axios from "axios";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");

  // Google Provider
  const googleProvider = new GoogleAuthProvider();

  const createUser = (email, pass) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, pass);
  };

  // Sign in with email and password
  const signIn = (email, pass) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, pass);
  };

  // Sign in with Google
  const signInWithGoogle = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  // Sign out
  const logOut = async () => {
    setLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/logout`,
        {},
        { withCredentials: true },
      );

      return signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
      return signOut(auth);
    }
  };

  // Update user role
  const updateUserRole = async (email, newRole) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/users/role/${email}`,
        { role: newRole },
      );
      setRole(newRole);
    } catch (error) {
      console.error("Error updating user role:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        try {
          // Generate JWT token
          const tokenResponse = await axios.post(
            `${import.meta.env.VITE_API_URL}/jwt`,
            { email: currentUser.email },
            { withCredentials: true },
          );

          // Get user role
          const roleResponse = await axios.get(
            `${import.meta.env.VITE_API_URL}/users/role/${currentUser.email}`,
          );

          setRole(roleResponse.data.role || "student");
        } catch (error) {
          console.error("Error fetching user data:", error);
          setRole("student"); // Default role
        }
      } else {
        setRole("");
      }

      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const authData = {
    user,
    setUser,
    loading,
    setLoading,
    createUser,
    signIn,
    signInWithGoogle,
    logOut,
    role,
    setRole,
  };
  
  return <AuthContext value={authData}>{children}</AuthContext>;
};

export default AuthProvider;
