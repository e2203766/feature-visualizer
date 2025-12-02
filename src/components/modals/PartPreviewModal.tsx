// src/components/modals/PartPreviewModal.tsx
import { AnimatePresence } from "framer-motion";
import type { Part } from "../../types";
import { Backdrop, MotionModal } from "../ui/ModalPrimitives";

const FALLBACK_VIDEO_URL = "/assets/demo2.mp4";

type Props = {
  open: boolean;
  onClose: () => void;
  part: Part | null;
};

export function PartPreviewModal({ open, onClose, part }: Props) {
  if (!open || !part) return null;

  const videoUrl = part.previewVideoUrl ?? FALLBACK_VIDEO_URL;

  return (
    <AnimatePresence>
      {open && (
        <Backdrop onClose={onClose}>
          <MotionModal className="max-w-[900px] w-full">
            <div className="modal-header">
              <div className="modal-title flex flex-col">
                <span>3D / Photo preview</span>
                <span className="text-xs text-slate-500">
                  {part.id} — {part.name}
                </span>
              </div>
              <button className="btn" onClick={onClose}>
                ✖
              </button>
            </div>

            <div className="modal-body space-y-4">
              <div className="grid md:grid-cols-2 gap-4 items-stretch">
                {/* Фото / рендер */}
                <div className="card flex items-center justify-center">
                  {part.imageUrl ? (
                    <img
                      src={part.imageUrl}
                      alt={part.name}
                      className="max-h-[360px] w-auto object-contain"
                    />
                  ) : (
                    <div className="text-sm text-slate-500">
                      No photo available for this part.
                    </div>
                  )}
                </div>

                {/* Видео-«3D» */}
                <div className="card flex flex-col">
                  <div className="text-sm font-semibold mb-2">
                    3D Preview (demo)
                  </div>
                  <div className="flex-1 flex items-center justify-center">
                    <video
                      src={videoUrl}
                      controls
                      className="w-full max-h-[360px] rounded-lg border"
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    This is a demo recording to illustrate how a full CAD / 3D
                    viewer could look for this product.
                  </p>
                </div>
              </div>

              {/* Related information links */}
              <div className="mt-2 pt-3 border-t">
                <div className="text-sm font-semibold mb-2">
                  Related information
                </div>
                <div className="flex flex-wrap gap-4 text-sm">
                  <button
                    type="button"
                    className="inline-flex items-center text-sky-700 hover:text-sky-900"
                    onClick={() => alert("Features Catalogue download (demo)")}
                  >
                    <span className="mr-1">⬇</span>
                    <span>Features catalogue</span>
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center text-sky-700 hover:text-sky-900"
                    onClick={() => alert("Download CAD (demo)")}
                  >
                    <span className="mr-1">⬇</span>
                    <span>Download CAD</span>
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center text-sky-700 hover:text-sky-900"
                    onClick={() => alert("Download datasheet (demo)")}
                  >
                    <span className="mr-1">⬇</span>
                    <span>Download datasheet</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn" onClick={onClose}>
                Close
              </button>
            </div>
          </MotionModal>
        </Backdrop>
      )}
    </AnimatePresence>
  );
}
