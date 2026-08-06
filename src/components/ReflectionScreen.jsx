import { useEffect, useRef, useState } from 'react';
import { TitleBar } from './TitleBar.jsx';

// Open-ended question before the first scenario. The answer is kept in App
// state so it survives Back; "saved" only shows once something was entered.
export function ReflectionScreen({ answer, onSaveAnswer, onStart, onReview }) {
  const [draft, setDraft] = useState(answer ?? '');
  const [saved, setSaved] = useState(Boolean(answer));
  // Native caret is hidden; this tracks where to draw the block cursor.
  // The field is monospace, so the column index maps straight to `ch` units.
  const [caretCol, setCaretCol] = useState(0);
  const inputRef = useRef(null);

  // Land on the field the way a terminal does -- cursor already waiting.
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function syncCaret(e) {
    setCaretCol(e.target.selectionStart ?? e.target.value.length);
  }

  function save() {
    const trimmed = draft.trim();
    if (!trimmed) return;
    onSaveAnswer(trimmed);
    setSaved(true);
  }

  return (
    <div className="setup-screen">
      <div className="setup-card">
        <TitleBar label="S.03. GOALS" />
        <div className="setup-body">
          <div className="setup-inner reflect">
            <p className="reflect-line">
              But before we start...what is Environmental Justice in Technology for you?
            </p>

            <form
              className="reflect-field"
              onSubmit={(e) => {
                e.preventDefault();
                save();
              }}
            >
              <span className="reflect-caret">&rsaquo;</span>
              <span className="reflect-input-wrap">
                <input
                  ref={inputRef}
                  type="text"
                  className="reflect-input"
                  placeholder="Add your answer here."
                  value={draft}
                  onChange={(e) => {
                    setDraft(e.target.value);
                    setSaved(false);
                    syncCaret(e);
                  }}
                  onSelect={syncCaret}
                  onKeyUp={syncCaret}
                  onClick={syncCaret}
                  onFocus={syncCaret}
                  onBlur={save}
                />
                <span className="reflect-cursor" style={{ left: `${caretCol}ch` }} aria-hidden="true" />
              </span>
            </form>

            <p className="reflect-line reflect-saved" hidden={!saved}>
              Thank you! Your answer was saved.
            </p>

            <p className="reflect-line">Let&rsquo;s start?</p>

            <div className="reflect-choices">
              <button type="button" className="reflect-choice" onClick={onStart}>
                <span className="reflect-caret">&rsaquo;</span>YES!
              </button>
              <button type="button" className="reflect-choice" onClick={onReview}>
                <span className="reflect-caret">&rsaquo;</span>
                NO. I want to review the rules and goals again.
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
