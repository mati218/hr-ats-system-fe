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

    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", tokenData);
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

      const roleName =
        typeof currentUser.role === "string"
          ? currentUser.role
          : currentUser.role.roleName ||
            currentUser.role.name ||
            currentUser.roleName ||
            "";

      // Super Admin already has full access and does not need a protected role lookup.
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

      // Guard: Agar permissions exact same hain to state update bypass karein
      if (
        JSON.stringify(currentUser.role) === JSON.stringify(updatedRole)
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

  // Extract primitive string ID so object reference doesn't trigger effect loop
  const roleId =
    typeof user?.role === "object"
      ? user?.role?.id || user?.role?._id
      : user?.role;

  // ================= SINGLE API CALL ON MOUNT / ROLE CHANGE =================

  useEffect(() => {
    if (!token || !roleId) {
      return;
    }

    // Single time execution only when roleId is available
    refreshPermissions();

  }, [token, roleId, refreshPermissions]); // Sirf tab chalega jab roleId ya token update ho

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