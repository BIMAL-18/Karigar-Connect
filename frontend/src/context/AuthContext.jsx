import {
  createContext,
  useEffect,
  useState,
} from "react";

import authService from "../services/authService";

export const AuthContext =
  createContext(null);

export const AuthProvider = ({
  children,
}) => {
  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const storedUser =
      localStorage.getItem("user");

    if (storedUser) {
      try {
        setUser(
          JSON.parse(storedUser)
        );
      } catch {
        localStorage.removeItem(
          "user"
        );
      }
    }

    setLoading(false);
  }, []);

  const login = async (
    email,
    password
  ) => {
    const data =
      await authService.login({
        email,
        password,
      });

    const token =
      data.token ||
      data.accessToken;

    const loggedInUser =
      data.user;

    if (token) {
      localStorage.setItem(
        "token",
        token
      );
    }

    if (loggedInUser) {
      localStorage.setItem(
        "user",
        JSON.stringify(
          loggedInUser
        )
      );

      setUser(loggedInUser);
    }

    return data;
  };

  const register = async (
    userData
  ) => {
    return await authService.register(
      userData
    );
  };

  const logout = () => {
    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user"
    );

    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated:
      !!localStorage.getItem(
        "token"
      ),
  };

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
};