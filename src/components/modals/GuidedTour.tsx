import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Backdrop, MotionModal } from "../ui/ModalPrimitives";
import { fadeSlideUp } from "../../utils/animations";

export const GuidedTour: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const [step, setStep] = useState(1);

  return (
    <AnimatePresence>
      {open && (
        <Backdrop onClose={onClose}>
          <MotionModal className="max-w-[520px]">
            <div className="modal-header">
              <div className="modal-title">Quick tour ({step}/3)</div>
              <button className="btn" onClick={onClose}>
                ✖
              </button>
            </div>
            <motion.div
              className="modal-body space-y-2"
              key={step}
              variants={fadeSlideUp}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {step === 1 && (
                <p>
                  1) Click <b>Advanced search</b> to open multi-criteria panel.
                </p>
              )}
              {step === 2 && (
                <p>
                  2) Add <b>multiple document IDs</b> in the tag field.
                </p>
              )}
              {step === 3 && (
                <p>
                  3) Press <b>Search</b> to get results & export.
                </p>
              )}
            </motion.div>
            <div className="modal-footer">
              <button className="btn" onClick={onClose}>
                Skip
              </button>
              <div className="row">
                <button
                  className="btn"
                  disabled={step === 1}
                  onClick={() => setStep((s) => Math.max(1, s - 1))}
                >
                  Back
                </button>
                {step < 3 ? (
                  <button className="btn btn-primary" onClick={() => setStep((s) => s + 1)}>
                    Next
                  </button>
                ) : (
                  <button className="btn btn-primary" onClick={onClose}>
                    Done
                  </button>
                )}
              </div>
            </div>
          </MotionModal>
        </Backdrop>
      )}
    </AnimatePresence>
  );
};
