import { useEffect, useMemo, useRef, useState } from "react";

export function useLocalProgress(storageKey, initialValue) {
  // Load initial state from localStorage (merge with defaults)
  const [data, setData] = useState(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return initialValue;
      const saved = JSON.parse(raw);
      return { ...initialValue, ...saved };
    } catch {
      return initialValue;
    }
  });

  // Debounced saver to avoid spamming writes
  const t = useRef();
  const save = useMemo(
    () => (next) => {
      clearTimeout(t.current);
      t.current = setTimeout(() => {
        try {
          localStorage.setItem(storageKey, JSON.stringify(next));
        } catch {}
      }, 400);
    },
    [storageKey]
  );

  // Expose a setter that also persists
  const setAndSave = (updater) => {
    setData((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      save(next);
      return next;
    });
  };

  return [data, setAndSave];
}
