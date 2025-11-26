"use client";

import { Provider } from "react-redux";
import { store } from "@/store/store";
import { useTokenRefresh } from "@/hooks/useTokenRefresh";

function TokenRefreshWrapper({ children }: { children: React.ReactNode }) {
  useTokenRefresh(5, 10);

  return <>{children}</>;
}

export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <TokenRefreshWrapper>{children}</TokenRefreshWrapper>
    </Provider>
  );
}
