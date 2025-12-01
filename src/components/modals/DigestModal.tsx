import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Backdrop, MotionModal } from "../ui/ModalPrimitives";

type Props = {
  open: boolean;
  onClose: () => void;
  onDeepLink: (dest: "read" | "video" | "try") => void;
};

export const DigestModal: React.FC<Props> = ({ open, onClose, onDeepLink }) => (
  <AnimatePresence>
    {open && (
      <Backdrop onClose={onClose}>
        <MotionModal className="max-w-[620px]">
          <div className="modal-header">
            <div className="modal-title">Feature digest</div>
            <button className="btn" onClick={onClose}>
              ✖
            </button>
          </div>
          <div className="modal-body space-y-2">
            <p>
              <b>Hi Kostiantyn!</b> 3 updates since your last visit:
            </p>
            <ul className="list-disc pl-5 text-sm text-slate-700">
              <li>Advanced Search: multiple-document IDs</li>
              <li>Recently Approved: export to Excel</li>
              <li>Data source refreshed (EDW/WDP Nova SAP)</li>
            </ul>
          </div>
          <div className="modal-footer">
            <motion.button className="btn" whileTap={{ scale: 0.97 }} onClick={() => onDeepLink("read")}>
              Read
            </motion.button>
            <motion.button className="btn btn-ghost" whileTap={{ scale: 0.97 }} onClick={() => onDeepLink("video")}>
              Video
            </motion.button>
            <motion.button className="btn btn-primary" whileTap={{ scale: 0.97 }} onClick={() => onDeepLink("try")}>
              Try now
            </motion.button>
          </div>
        </MotionModal>
      </Backdrop>
    )}
  </AnimatePresence>
);
