// src/components/ui/ModalPrimitives.tsx
import React from "react";
import { motion } from "framer-motion";
import { fadeScale } from "../../utils/animations";

type BackdropProps = {
  children: React.ReactNode;
  onClose: () => void;
};

export const Backdrop: React.FC<BackdropProps> = ({ children, onClose }) => (
  <motion.div
    className="modal-backdrop"
    onClick={onClose}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    {/* этот внутренний контейнер НЕ даёт клику по контенту закрывать модалку */}
    <div
      className="modal-backdrop-inner"
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  </motion.div>
);

type MotionModalProps = {
  children: React.ReactNode;
  className?: string;
};

export const MotionModal: React.FC<MotionModalProps> = ({
  children,
  className = "",
}) => (
  <motion.div
    className={`modal ${className}`}
    variants={fadeScale}
    initial="initial"
    animate="animate"
    exit="exit"
  >
    {children}
  </motion.div>
);


