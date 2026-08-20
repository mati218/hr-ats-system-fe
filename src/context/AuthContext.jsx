import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { getRole } from "../lib/api/authroleApi";
import { AuthContext } from "./AuthContextValue";

const safeReadStoredUser = () => {
  try {
    const savedUser = localStorage.getItem("user");

    if (
      !savedUser ||
      savedUser === "undefined" ||
      savedUser === "null"
    ) {
      return null;
    }

    return JSON.parse(savedUser);
  } catch {
    console.warn("Invalid stored user data, clearing it.");

    localStorage.removeItem("user");

    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => safeReadStoredUser());

  const [token, setToken] = useState(
    () => localStorage.getItem("token") || null
  );
  const userRef = useRef(user);

  useEffect(() => {
    userRef.current = user;
  }, [user]);

 

  const login = (userData, tokenData) => {
    setUser(userData);
    setToken(tokenData);

    localStorage.setItem(
      "user",
      JSON.stringify(userData)
    );

    localStorage.setItem(
      "token",
      tokenData
    );
  };

 

  const logout = () => {
    setUser(null);
    setToken(null);

    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  

  const refreshPermissions = useCallback(async () => {
    try {
      const currentUser = userRef.current;

      if (!currentUser || !currentUser.role) {
        return;
      }

      // Support both id and _id
      const roleId =
        currentUser.role.id ||
        currentUser.role._id;

      if (!roleId) {
        console.log("Role ID not found");
        return;
      }

      const response = await getRole(roleId);

      // Support different API response structures
      const latestRole =
        response?.data?.data ||
        response?.data;

      if (!latestRole) {
        console.log("Role data not found");
        return;
      }

      const updatedUser = {
        ...currentUser,

        role: {
          ...currentUser.role,

          id:
            latestRole.id ||
            latestRole._id ||
            roleId,

          _id:
            latestRole._id ||
            latestRole.id ||
            roleId,

          roleName:
            latestRole.roleName ||
            currentUser.role.roleName,

          permissions:
            latestRole.permissions || [],
        },
      };

      setUser(updatedUser);

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );
    } catch (error) {
      console.log(
        "Permission refresh failed:",
        error.response?.data || error.message
      );
    }
  }, []);

  // ================= AUTO REFRESH =================

  useEffect(() => {
    if (!token || !user?.role) {
      return;
    }

    const refreshTimeout = setTimeout(() => {
      void refreshPermissions();
    }, 0);

    const interval = setInterval(() => {
      void refreshPermissions();
    }, 5000);

    return () => {
      clearTimeout(refreshTimeout);
      clearInterval(interval);
    };
  }, [token, user?.role, refreshPermissions]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        refreshPermissions,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};



