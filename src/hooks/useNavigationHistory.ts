"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export const useNavigationHistory = () => {
  const router = useRouter();
  const pathname = usePathname();
  const historyRef = useRef<string[]>([]);
  const [canGoBack, setCanGoBack] = useState(false); // 👈 Estado reactivo

  // Cuando cambia la ruta, la agregamos al stack
  useEffect(() => {
    const history = historyRef.current;
    const last = history[history.length - 1];
    if (last !== pathname) {
      history.push(pathname);
      setCanGoBack(history.length > 1);
    }
  }, [pathname]);

  // Retroceder una pantalla
  const goBack = () => {
    const history = historyRef.current;
    history.pop(); // quitar la ruta actual
    const previous = history[history.length - 1];
    setCanGoBack(history.length > 1);
    if (previous) router.push(previous);
  };

  return { goBack, canGoBack };
};
