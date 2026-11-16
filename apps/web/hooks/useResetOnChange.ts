"use client";

import { useState } from "react";

export function useResetOnChange<T>(value: T, reset: () => void) {
  const [prev, setPrev] = useState(value);

  if (value !== prev) {
    setPrev(value);
    reset();
  }
}
