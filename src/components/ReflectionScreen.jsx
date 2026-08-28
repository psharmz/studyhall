import { TitleBar } from './TitleBar.jsx';

// The vocabulary offered for the opening question. Order is deliberate --
// it is the order they are shown in.
const REFLECT_WORDS = [
  'Equity',
  'Access',
  'Sustainability',
  'Impact',
  'Justice',
  'Waste',
  'Communities',
  'Pollution',
  'E-waste',
  'Digital divide',
  'Inclusion',
  'Accountability',
  'Extraction',
  'Power',
  'Resources',
  'Representation',
  'Transparency',
  'Harm',
  'Solutions',
  'Marginalized',
  'Responsibility',
  'Climate',
  'Labor',
  'Data',
  'Participation',
  'Rights',
  'Supply chain',
  'Toxicity',
  'Health',
  'Sovereignty',
];

// Opening question before the first scenario: pick as many words as you like.
// The picks live in App state so they survive a trip back to the rules; one
// day they will be posted to a data store, but nothing is sent anywhere yet.
// `label` is passed in because Study Mode inserts an extra intro screen ahead
// of this one, pushing its number along by one. Study Mode skips the word
// question entirely -- it keeps only the "Let's start?" choice.
export function ReflectionScreen({
  label = 'S.04. GOALS',
  study = false,
  answer,
  onSaveAnswer,
  onStart,
  onReview,
}) {
  const selected = answer ?? [];

  function toggle(word) {
    onSaveAnswer(
      selected.includes(word) ? selected.filter((w) => w !== word) : [...selected, word]
    );
  }

  return (
    <div className="setup-screen">
      {/* Shares the info screens' fixed footprint so the window does not
          jump on the step in from Consent -- badly needed in Study Mode,
          where the copy here is down to two short lines. */}
      <div className="setup-card setup-card--info">
        <TitleBar label={label} />
        <div className="setup-body">
          <div className="setup-inner reflect">
            {!study && (
              <>
                <p className="reflect-line">
                  But before we start...what is Environmental Justice in Technology for you?
                </p>
                <p className="reflect-line reflect-hint">Pick as many words as you like.</p>

                <div className="reflect-words" role="group" aria-label="Words you would choose">
                  {REFLECT_WORDS.map((word) => {
                    const on = selected.includes(word);
                    return (
                      <button
                        key={word}
                        type="button"
                        className={on ? 'reflect-word reflect-word--on' : 'reflect-word'}
                        aria-pressed={on}
                        onClick={() => toggle(word)}
                      >
                        {word}
                      </button>
                    );
                  })}
                </div>

                {/* Always in the layout -- invisible at zero, so the lines below
                    do not jump when the first chip is picked. */}
                <p
                  className={
                    selected.length
                      ? 'reflect-line reflect-saved'
                      : 'reflect-line reflect-saved reflect-saved--empty'
                  }
                  aria-live="polite"
                >
                  {selected.length} word{selected.length === 1 ? '' : 's'} selected.
                </p>
              </>
            )}

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
