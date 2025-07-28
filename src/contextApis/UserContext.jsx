// UserContext.jsx
import { createContext, useContext, useState } from "react";

const UserContext = createContext(); // no default value for now

export function UserProvider({ children }) {
  const [user, setUser] = useState(null); // shared state

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

// Custom hook for convenience
export function useUser() {
  return useContext(UserContext);
}
