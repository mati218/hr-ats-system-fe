import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";

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

  // ================= LOGIN =================

  const login = (userData, tokenData) => {
    setUser(userData);
    setToken(tokenData);

    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", tokenData);
  };

  // ================= NORMAL LOGOUT =================

  const logout = () => {
    setUser(null);
    setToken(null);

    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  // ================= EXPIRED SESSION =================

  const handleExpiredSession = useCallback(() => {
    setUser(null);
    setToken(null);

    localStorage.removeItem("user");
    localStorage.removeItem("token");

    toast.success("Session expired. Please login again.");

    setTimeout(() => {
      window.location.href = "/login";
    }, 2500);
  }, []);

  // ================= JWT EXPIRATION CHECK =================

  useEffect(() => {
    if (!token) {
      return;
    }

    try {
      const decodedToken = jwtDecode(token);

      if (!decodedToken.exp) {
        console.warn("Token does not contain expiration time.");
        return;
      }

      const expirationTime = decodedToken.exp * 1000;
      const currentTime = Date.now();

      // Token is already expired
      // Token is already expired
      if (expirationTime <= currentTime) {
        const timeout = setTimeout(() => {
          handleExpiredSession();
        }, 0);

        return () => clearTimeout(timeout);
      }

      // Automatically handle expiration while user is using the app
      const timeout = setTimeout(() => {
        handleExpiredSession();
      }, expirationTime - currentTime);

      return () => clearTimeout(timeout);
    } catch (error) {
      console.error("Invalid JWT token:", error);

      const timeout = setTimeout(() => {
        handleExpiredSession();
      }, 0);

      return () => clearTimeout(timeout);
    }
  }, [token, handleExpiredSession]);

  // ================= REFRESH PERMISSIONS =================

  const refreshPermissions = useCallback(async () => {
    try {
      const currentUser = userRef.current;

      if (!currentUser || !currentUser.role) {
        return;
      }

      const roleName =
        typeof currentUser.role === "string"
          ? currentUser.role
          : currentUser.role.roleName ||
          currentUser.role.name ||
          currentUser.roleName ||
          "";

      // Super Admin already has full access
      // and does not need a protected role lookup.
      if (
        String(roleName)
          .toLowerCase()
          .replace(/\s+/g, "") === "superadmin"
      ) {
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

      const updatedRole = {
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
      };

      // If permissions are exactly the same,
      // don't update state unnecessarily.
      if (
        JSON.stringify(currentUser.role) ===
        JSON.stringify(updatedRole)
      ) {
        return;
      }

      const updatedUser = {
        ...currentUser,
        role: updatedRole,
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

  // ================= ROLE ID =================

  const roleId =
    typeof user?.role === "object"
      ? user?.role?.id || user?.role?._id
      : user?.role;

  // ================= SINGLE API CALL ON MOUNT / ROLE CHANGE =================

  useEffect(() => {
    if (!token || !roleId) {
      return;
    }

    refreshPermissions();
  }, [token, roleId, refreshPermissions]);

  // ================= CONTEXT =================

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