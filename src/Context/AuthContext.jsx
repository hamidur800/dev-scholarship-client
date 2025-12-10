import React, { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { auth } from "../Config/firebase.config";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Register user
  const registerUser = async (email, password, name, photoURL) => {
    try {
      setError(null);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with name and photo
      await updateProfile(result.user, {
        displayName: name,
        photoURL: photoURL,
      });

      // Save user to database
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/users`, {
        email: result.user.email,
        name: name,
        photoURL: photoURL,
        role: "Student",
        uid: result.user.uid,
      });

      return response.data;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Login user
  const loginUser = async (email, password) => {
    try {
      setError(null);
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Google Login
  const googleLogin = async () => {
    try {
      setError(null);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Check if user exists in database, if not create
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/users`, {
        email: result.user.email,
        name: result.user.displayName,
        photoURL: result.user.photoURL,
        role: "Student",
        uid: result.user.uid,
      });

      return result.user;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Logout user
  const logoutUser = async () => {
    try {
      setError(null);
      await signOut(auth);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Monitor auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        try {
          // Get JWT token
          const token = await currentUser.getIdToken();
          localStorage.setItem("authToken", token);
          
          // Set axios default header
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        } catch (error) {
          console.error("Error getting token:", error);
        }
      } else {
        localStorage.removeItem("authToken");
        delete axios.defaults.headers.common["Authorization"];
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    loading,
    error,
    registerUser,
    loginUser,
    googleLogin,
    logoutUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
