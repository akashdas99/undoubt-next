import { useShallow } from "zustand/react/shallow";
import type { StoreApi, UseBoundStore } from "zustand";

/**
 * Select multiple properties directly from a store with shallow comparison
 *
 * @example
 * const { deleteModal } = useMulti(useUIStore, "deleteModal");
 */
export function useMulti<TState extends object, K extends keyof TState>(
  store: UseBoundStore<StoreApi<TState>>,
  ...keys: K[]
): Pick<TState, K> {
  return store(
    useShallow((state) =>
      keys.reduce(
        (acc, key) => ({ ...acc, [key]: state[key] }),
        {} as Pick<TState, K>,
      ),
    ),
  );
}
