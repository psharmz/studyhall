import { useEffect, useRef } from 'react';

// Who to write to about supporting the game. There is nothing to buy and no
// form to fill in -- the ask is a conversation, so the modal is one line and an
// address rather than a checkout.
//
// It borrows the share sheet's overlay and panel: the two are the same kind of
// thing on the same screen, and having them open looking different would read
// as an accident.
export const SUPPORT_EMAIL = 'felipe@rootedfutureslab.io';

export function SupportSheet({ onClose }) {
  const closeRef = useRef(null);

  useEffect(() => {
    closeRef.current?.focus();
    function onKey(e) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="share-overlay" role="presentation" onClick={onClose}>
      <div
        className="share-sheet share-sheet--support"
        role="dialog"
        aria-modal="true"
        aria-label="Support Study Hall"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="share-sheet-head">
          <h2>Support Study Hall</h2>
          <button
            type="button"
            className="share-close"
            onClick={onClose}
            aria-label="Close"
            ref={closeRef}
          >
            ✕
          </button>
        </div>

        <p className="support-copy">
          If you would like to support Study Hall financially or otherwise, please reach out to{' '}
          <a className="support-email" href={`mailto:${SUPPORT_EMAIL}`}>
            {SUPPORT_EMAIL}
          </a>
        </p>
      </div>
    </div>
  );
}
