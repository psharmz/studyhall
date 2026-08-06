import { Fragment } from 'react';
import { TitleBar } from './TitleBar.jsx';
import { useTypewriter } from '../useTypewriter.js';

const PARA_BREAK = '\n\n';

export function PromptScreen({ scenario, index, total, onSelectAnswer }) {
  const fullText = scenario.paragraphs.join(PARA_BREAK);
  const { visible, done, skip } = useTypewriter(fullText);
  const paragraphs = visible.split(PARA_BREAK);

  return (
    <div className="screen-prompt">
      <div className="card card--prompt">
        <TitleBar label={`${scenario.code}. STUDY HALL`} />
        <div className="body">
          <h1 className="pixel">
            {scenario.titleLines.map((line, i) => (
              <Fragment key={i}>
                {i > 0 && <br />}
                {line}
              </Fragment>
            ))}
          </h1>
          <div className="content-row">
            <div className="story-col">
              <div className="story-text-wrap">
                {paragraphs.map((p, i) => (
                  <p key={i}>
                    {p}
                    {!done && i === paragraphs.length - 1 && <span className="type-caret" />}
                  </p>
                ))}
              </div>
              {done && (
                <button type="button" className="select-answer-btn" onClick={onSelectAnswer}>
                  Select Answer
                </button>
              )}
            </div>
          </div>
          {!done && (
            <button type="button" className="skip-type-btn" onClick={skip}>
              Skip Typewriter Effect
            </button>
          )}
        </div>
        <div className="footer">
          <div className="pips">
            {Array.from({ length: total }, (_, i) => (
              <span key={i} className={i <= index ? 'filled' : ''} />
            ))}
          </div>
          <div className="caption">STUDY HALL BY ROOTED FUTURES LAB</div>
        </div>
      </div>
    </div>
  );
}
