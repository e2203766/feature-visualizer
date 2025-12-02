// src/components/ui/Indicator.tsx
import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { fadeScale } from "../../utils/animations";

export type HighlightStyle = "glow" | "badge";

type Props = {
  id: string;
  children: ReactNode;
  /** Глобальный флаг “Highlight new” */
  show: boolean;
  /** Glow / Badges переключатель в топбаре */
  style: HighlightStyle;
  /** Какие индикаторы уже скрыты пользователем */
  dismissed: Record<string, boolean>;
  /** Пометить индикатор как скрытый */
  onDismiss: (id: string) => void;
  /** Дополнительный класс-обёртки */
  className?: string;
  /** Заголовок поповера (опционально) */
  title?: string;
  /** Текст поповера (опционально) */
  body?: string;
};

export const Indicator = ({
  id,
  children,
  show,
  style,
  dismissed,
  onDismiss,
  className = "",
  title,
  body,
}: Props) => {
  const [open, setOpen] = useState(false);

  // если highlight выключен или этот индикатор уже погашен — просто рендерим детей
  if (!show || dismissed[id]) {
    return <>{children}</>;
  }

  const handleDismiss = () => {
    onDismiss(id);
    setOpen(false);
  };

  return (
    <div className={`relative inline-block ${className}`}>
      {/* контент, который подсвечиваем */}
      {children}

      {/* красный кружок / бейдж NEW */}
      {!open && (
        <button
          type="button"
          className="new-dot"
          onClick={() => setOpen(true)}
          aria-label="Show what is new here"
        >
          {style === "badge" ? "★" : "!"}
        </button>
      )}

      {/* поповер с описанием (если есть title/body) */}
      <AnimatePresence>
        {open && (title || body) && (
          <motion.div
            className="popover"
            variants={fadeScale}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {title && <div className="popover-title">{title}</div>}
            {body && <div className="popover-body">{body}</div>}
            <div className="popover-actions">
              <button className="btn btn-primary" onClick={handleDismiss}>
                Got it
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

