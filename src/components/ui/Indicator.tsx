import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { fadeScale } from "../../utils/animations";

export type HighlightStyle = "glow" | "badge";

type Props = {
  id: string;
  title: string;
  body: string;
  children: React.ReactNode;
  onDismiss: (id: string) => void;
  show: boolean;
  className?: string;
};

export const Indicator: React.FC<Props> = ({
  id,
  title,
  body,
  children,
  onDismiss,
  show,
  className = "",
}) => {
  const [open, setOpen] = useState(false);

  if (!show) return <>{children}</>;

  return (
    <div className={`relative inline-block ${className}`}>
      {children}
      {!open && (
        <button className="new-dot" onClick={() => setOpen(true)}>
          !
        </button>
      )}
      <AnimatePresence>
        {open && (
          <motion.div
            className="popover"
            variants={fadeScale}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <div className="popover-title">{title}</div>
            <div className="popover-body">{body}</div>
            <div className="popover-actions">
              <button
                className="btn btn-primary"
                onClick={() => {
                  onDismiss(id);
                  setOpen(false);
                }}
              >
                Got it
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

