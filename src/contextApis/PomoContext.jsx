// UserContext.jsx
import { createContext, useContext, useState } from "react";

const PomoContext = createContext(); // no default value for now

export function PomoProvider({ children }) {
  const [pomoPause, setPomoPause] = useState({state: null, value: null, start: null}); // shared state

  return (
    <PomoContext.Provider value={{ pomoPause, setPomoPause }}>
      {children}
    </PomoContext.Provider>
  );
}

// Custom hook for convenience
export function usePomo() {
  return useContext(PomoContext);
}
