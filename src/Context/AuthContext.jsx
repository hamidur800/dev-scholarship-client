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
import { loginUser as loginUserAPI, registerUser as registerUserAPI } from "../Api/authApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [dbUser, setDbUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Register user
  const registerUser = async (email, password, name, photoURL) => {
    try {
      setError(null);
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Update profile with name and photo
      await updateProfile(result.user, {
        displayName: name,
        photoURL: photoURL || null,
      });

      // Get Firebase token
      const token = await result.user.getIdToken();
      localStorage.setItem("authToken", token);

      // Save user to database via API
      const response = await registerUserAPI({
        name,
        email: result.user.email,
        photoURL: photoURL || null,
        firebaseUid: result.user.uid,
      });

      if (response.token) {
        localStorage.setItem("authToken", response.token);
      }

      return response;
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
      
      // Get Firebase token and login via API
      const firebaseToken = await result.user.getIdToken();
      const response = await loginUserAPI(firebaseToken);
      
      if (response.token) {
        localStorage.setItem("authToken", response.token);
      }

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

      // Get Firebase token and login via API
      const firebaseToken = await result.user.getIdToken();
      const response = await loginUserAPI(firebaseToken);
      
      if (response.token) {
        localStorage.setItem("authToken", response.token);
      }

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
      localStorage.removeItem("authToken");
      delete axios.defaults.headers.common["Authorization"];
      setDbUser(null);
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

          // Fetch user from database
          try {
            const userResponse = await axios.get(
              `${import.meta.env.VITE_API_BASE_URL}/api/auth/user/${currentUser.email}`
            );
            setDbUser(userResponse.data);
          } catch (err) {
            console.error("Error fetching user from database:", err);
          }
        } catch (error) {
          console.error("Error getting token:", error);
        }
      } else {
        localStorage.removeItem("authToken");
        delete axios.defaults.headers.common["Authorization"];
        setDbUser(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    dbUser,
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
