import axios from "axios";
import { useMemo } from "react";

const useAxios = () => {
  const instance = useMemo(
    () =>
      axios.create({
        baseURL: import.meta.env.VITE_API_URL,
        withCredentials: true,
        timeout: 15000,
      }),
    [],
  );

  return instance;
};

export default useAxios;
