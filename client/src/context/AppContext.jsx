import { createContext, useEffect, useState } from "react";

export const AppContext = createContext(null);

const AppcontextProvider = (props) => {
  const [user, setUser] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("account");
    setUser("");
  };

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("account")));
  }, []);

  const contextValue = {
    user,
    setUser,
    backendUrl,
    logout,
    token,
    setToken,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppcontextProvider;
