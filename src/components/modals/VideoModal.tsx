import React, { useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { Backdrop, MotionModal } from "../ui/ModalPrimitives";
import demoVideo from "../../assets/demo1.mp4"; // 👈 импорт файла как модуля

type Props = {
  open: boolean;
  onClose: () => void;
  src?: string;        // опционально – можно передать другой ролик
  autoPlay?: boolean;
};

export const VideoModal: React.FC<Props> = ({
  open,
  onClose,
  src,
  autoPlay = true,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    if (open && autoPlay) {
      v.currentTime = 0;
      const playPromise = v.play();
      if (playPromise && typeof playPromise.then === "function") {
        playPromise.catch((err) => {
          console.warn("Video autoplay failed:", err);
        });
      }
    } else {
      v.pause();
      v.currentTime = 0;
    }
  }, [open, autoPlay]);

  return (
    <AnimatePresence>
      {open && (
        <Backdrop onClose={onClose}>
          <MotionModal className="w-[880px] max-w-[92vw]">
            <div className="modal-header">
              <div className="modal-title">Video walkthrough</div>
              <button className="btn" onClick={onClose}>
                ✖
              </button>
            </div>
            <div className="modal-body">
              <div className="w-full aspect-video bg-slate-200 rounded-xl overflow-hidden">
                <video
                  ref={videoRef}
                  src={src ?? demoVideo}          // 👈 по умолчанию demo1.mp4
                  controls
                  playsInline
                  style={{ width: "100%", height: "100%", display: "block" }}
                />
              </div>
            </div>
          </MotionModal>
        </Backdrop>
      )}
    </AnimatePresence>
  );
};




