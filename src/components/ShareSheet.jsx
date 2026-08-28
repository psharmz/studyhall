import { useEffect, useRef, useState } from 'react';
import { EndingArt } from './EndingArt.jsx';
import { ENDING_ALIGN, ENDING_CAPTIONS } from '../endings.js';
import {
  buildEmailSubject,
  buildShareText,
  DIAL_BAR,
  GAME_NAME,
  GAME_SUBTITLE,
  shareLabelFor,
  shareUrl,
} from '../share.js';

// What Share opens: a look at the card before it goes anywhere, then the ways
// to send it. Nothing is sent until one of those is pressed -- the point is
// that you see exactly what your friend will see first.
export function ShareSheet({ ending, score, max, onClose, onShared }) {
  const [copied, setCopied] = useState(false);
  const closeRef = useRef(null);
  const copyTimer = useRef(null);

  const url = shareUrl();
  const text = buildShareText({ ending, score, max, url });
  // Only offered where the OS actually has a share sheet -- on a desktop
  // browser without one the button would do nothing.
  const canMessage = typeof navigator !== 'undefined' && !!navigator.share;

  useEffect(() => {
    closeRef.current?.focus();
    function onKey(e) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      clearTimeout(copyTimer.current);
    };
  }, [onClose]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      onShared('clipboard');
      copyTimer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked -- the text is on screen to copy by hand */
    }
  }

  function handleEmail() {
    const subject = encodeURIComponent(buildEmailSubject(ending));
    const body = encodeURIComponent(text);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    onShared('email');
  }

  async function handleMessage() {
    try {
      await navigator.share({ title: GAME_NAME, text });
      onShared('native_share');
    } catch {
      /* dismissed -- not a failure, and not worth reporting */
    }
  }

  return (
    <div className="share-overlay" role="presentation" onClick={onClose}>
      <div
        className="share-sheet"
        role="dialog"
        aria-modal="true"
        aria-label="Share your result"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="share-sheet-head">
          <h2>Share your result</h2>
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

        {/* The card as the recipient will see it. */}
        <div className="share-preview">
          <div className="share-preview-title">
            <span className="share-preview-game">{GAME_NAME}</span>
            <span className="share-preview-sub">{GAME_SUBTITLE}</span>
          </div>
          <div className="share-preview-art">
            <EndingArt ending={ending} />
          </div>
          <div className="chip" data-align={ENDING_ALIGN[ending]}>
            {shareLabelFor(ending)} <b className="chip-score">{score}</b>
          </div>
          <div className="share-preview-dial" aria-hidden="true">
            {DIAL_BAR[ending]}
          </div>
          <p className="share-preview-caption">{ENDING_CAPTIONS[ending]}</p>
          <p className="share-preview-link">{url}</p>
        </div>

        {/* The literal characters that get sent, so there is no surprise
            between the card above and what lands in the message. */}
        <pre className="share-text">{text}</pre>

        <div className="share-actions">
          <button type="button" className="btn" onClick={handleCopy}>
            {copied ? 'Copied' : 'Copy'}
          </button>
          <button type="button" className="btn" onClick={handleEmail}>
            Email
          </button>
          {canMessage && (
            <button type="button" className="btn" onClick={handleMessage}>
              Message
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
