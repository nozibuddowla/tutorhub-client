import { useState } from "react";

const useLocalStorage = (key, initialValue) => {
  const [stored, setStored] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const val = value instanceof Function ? value(stored) : value;
      setStored(val);
      window.localStorage.setItem(key, JSON.stringify(val));
    } catch {
      // silent in production
    }
  };

  return [stored, setValue];
};

export default useLocalStorage;
