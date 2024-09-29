"use client";
import { useEffect, useRef, useState } from "react";

const useDebounce = (value: string, timeout: number) => {
  const [debouncedValue, setDebouncedValue] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => {
    timer.current = setTimeout(() => setDebouncedValue(value), timeout);

    return () => {
      clearTimeout(timer.current);
    };
  }, [value, timeout]);

  return debouncedValue;
};

export default useDebounce;
