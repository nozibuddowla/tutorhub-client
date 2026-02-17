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

  // ─── AXIOS INTERCEPTOR ───────────────────────────────────────────────────────
  // Automatically handle 401 (token expired/invalid) responses globally
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response, // Pass through successful responses

      async (error) => {
        const status = error?.response?.status;
        const originalRequest = error?.config;

        // If 401 and not already retrying and not a login/logout request
        if (
          status === 401 &&
          !originalRequest._retry &&
          !originalRequest.url.includes("/jwt") &&
          !originalRequest.url.includes("/logout") &&
          !originalRequest.url.includes("/users/role")
        ) {
          originalRequest._retry = true;

          // Token expired - force logout
          try {
            await axios.post(
              `${import.meta.env.VITE_API_URL}/logout`,
              {},
              { withCredentials: true },
            );
          } catch (e) {
            // Silent fail - logout anyway
          }

          await signOut(auth);
          setUser(null);
          setRole("");

          // Redirect to login
          window.location.href = "/login";
        }

        return Promise.reject(error);
      },
    );

    // Cleanup interceptor on unmount
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  // ─── AUTH METHODS ────────────────────────────────────────────────────────────

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

  // ─── AUTH STATE LISTENER ─────────────────────────────────────────────────────
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        try {
          // Get user role
          const roleResponse = await axios.get(
            `${import.meta.env.VITE_API_URL}/users/role/${currentUser.email}`,
          );

          if (roleResponse.data.success) {
            setRole(roleResponse.data.role);
            // Only get JWT if the user is confirmed in the DB
            await axios.post(
              `${import.meta.env.VITE_API_URL}/jwt`,
              { email: currentUser.email },
              { withCredentials: true },
            );
          }
        } catch (error) {
          console.error("Auth initialization error:", error);
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
