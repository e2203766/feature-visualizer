import { useState } from "react";

export function useDismissedIndicators() {
  const [dismissed, setDismissed] = useState<Record<string, boolean>>(() => {
    try {
      return JSON.parse(localStorage.getItem("dismissedIndicators") || "{}");
    } catch {
      return {};
    }
  });

  const mark = (id: string) =>
    setDismissed((prev) => {
      const next = { ...prev, [id]: true };
      localStorage.setItem("dismissedIndicators", JSON.stringify(next));
      return next;
    });

  const resetAll = () => {
    localStorage.removeItem("dismissedIndicators");
    setDismissed({});
  };

  return { dismissed, mark, resetAll };
}
