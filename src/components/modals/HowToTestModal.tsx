import React from "react";

type Props = {
  open: boolean;
  onClose: () => void;
};

export const HowToTestModal: React.FC<Props> = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">How to test the features</div>
          <button className="btn" onClick={onClose}>✖</button>
        </div>

        <div className="modal-body text-sm space-y-4">

          <section>
            <h3 className="font-semibold mb-1">⭐ Highlight + Tooltip</h3>
            <p>Enable “Highlight new” in the top bar — new UI elements will glow or show a badge.</p>
          </section>

          <section>
            <h3 className="font-semibold mb-1">🎥 Video walkthrough</h3>
            <p>Open via Concept Gallery → Video walkthrough → plays a 15–30 sec explainer.</p>
          </section>

          <section>
            <h3 className="font-semibold mb-1">🧭 Guided tour</h3>
            <p>Starts a 3-step onboarding showing key UI areas.</p>
          </section>

          <section>
            <h3 className="font-semibold mb-1">⌨ Command palette</h3>
            <p>Press <b>Ctrl+K</b> to open quick actions, presets and deep-links.</p>
          </section>

          <section>
            <h3 className="font-semibold mb-1">📊 Compare view</h3>
            <p>Select 2–3 items in search results → go to Compare tab.</p>
          </section>

          <section>
            <h3 className="font-semibold mb-1">📥 Bulk Upload</h3>
            <ul className="list-disc ml-4">
              <li>Open: Search → Bulk upload</li>
              <li>Paste Excel/CSV list of IDs</li>
              <li>System highlights matches and non-existing IDs</li>
              <li>You can export cleaned CSV</li>
            </ul>
          </section>

          <section>
            <h3 className="font-semibold mb-1">🕓 Recently viewed</h3>
            <p>Click item rows → they appear under “Recently viewed”.</p>
          </section>

        </div>

        <div className="modal-footer">
          <button className="btn btn-primary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};
