"use client";
import { AppStore, makeStore } from "@/lib/store/store";
import { ReactNode, useState } from "react";
import { Provider } from "react-redux";

const StoreProvider = ({ children }: { children: ReactNode }) => {
  // Use lazy initialization to create store only once
  const [store] = useState<AppStore>(() => makeStore());
  return <Provider store={store}>{children}</Provider>;
};

export default StoreProvider;
