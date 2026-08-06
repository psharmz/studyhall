import { TitleBar } from './TitleBar.jsx';
import { NavFooter } from './NavFooter.jsx';

// Shared shell for the read-only screens between setup and the first
// scenario: card + pixel heading + body copy + back/next footer.
export function InfoScreen({ label, heading, paragraphs, onBack, onNext }) {
  return (
    <div className="setup-screen">
      <div className="setup-card">
        <TitleBar label={label} />
        <div className="setup-body">
          <div className="setup-inner">
            <h1 className="pixel">
              {heading.map((line, i) => (
                <span key={line}>
                  {i > 0 && <br />}
                  {line}
                </span>
              ))}
            </h1>

            <div className="rules-text">
              {paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>
        </div>
        <NavFooter onBack={onBack} onNext={onNext} />
      </div>
    </div>
  );
}
