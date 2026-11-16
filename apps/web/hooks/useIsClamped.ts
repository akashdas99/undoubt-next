import { useLayoutEffect, useRef, useState } from "react";

/** Returns whether the element's content overflows its clamped box. */
export function useIsClamped<T extends HTMLElement>(enabled = true) {
  const ref = useRef<T>(null);
  const [isClamped, setIsClamped] = useState(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!enabled || !el) {
      setIsClamped(false);
      return;
    }
    const check = () => setIsClamped(el.scrollHeight > el.clientHeight + 1);
    check();
    const observer = new ResizeObserver(check);
    observer.observe(el);
    return () => observer.disconnect();
  }, [enabled]);

  return { ref, isClamped };
}
