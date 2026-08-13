import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

const safeReadStoredUser = () => {
  try {
    const savedUser = localStorage.getItem("user");
    if (!savedUser || savedUser === "undefined" || savedUser === "null") {
      return null;
    }

    return JSON.parse(savedUser);
  } catch (error) {
    console.warn("Invalid stored user data, clearing it.", error);
    localStorage.removeItem("user");
    return null;
  }
};

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(() => safeReadStoredUser());

  const [token, setToken] = useState(
    localStorage.getItem("token") || null
  );


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


  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => useContext(AuthContext);