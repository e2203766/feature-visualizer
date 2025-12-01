import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Backdrop, MotionModal } from "../ui/ModalPrimitives";
import { fadeSlideUp } from "../../utils/animations";

type Props = {
  open: boolean;
  onClose: () => void;
  onCommand: (cmd: string) => void;
};

export const CommandPalette: React.FC<Props> = ({ open, onClose, onCommand }) => {
  const [q, setQ] = useState("");
  const cmds = [
    { id: "open-adv", label: "Open Advanced Search" },
    { id: "apply-preset", label: "Apply preset: Multi-Doc IDs" },
    { id: "toggle-highlight", label: "Toggle highlight new" },
    { id: "show-video", label: "Show video walkthrough" },
  ].filter((c) => c.label.toLowerCase().includes(q.toLowerCase()));

  return (
    <AnimatePresence>
      {open && (
        <Backdrop onClose={onClose}>
          <MotionModal className="max-w-[560px]">
            <div className="modal-header">
              <div className="modal-title">Command palette</div>
              <button className="btn" onClick={onClose}>
                ✖
              </button>
            </div>
            <div className="modal-body">
              <input
                className="w-full rounded-lg border px-3 py-2"
                placeholder="Type a command..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
                autoFocus
              />
              <div className="mt-3 space-y-2">
                <AnimatePresence mode="popLayout">
                  {cmds.map((c) => (
                    <motion.button
                      key={c.id}
                      className="btn btn-ghost w-full text-left"
                      onClick={() => onCommand(c.id)}
                      variants={fadeSlideUp}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      whileHover={{ x: 4 }}
                    >
                      {c.label}
                    </motion.button>
                  ))}
                </AnimatePresence>
                {cmds.length === 0 && <div className="text-sm text-slate-500">No matches</div>}
              </div>
            </div>
          </MotionModal>
        </Backdrop>
      )}
    </AnimatePresence>
  );
};
