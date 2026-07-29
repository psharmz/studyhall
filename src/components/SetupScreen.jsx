import { useState } from 'react';
import { TitleBar } from './TitleBar.jsx';

function SetupBtn({ selected, onClick, children }) {
  return (
    <button
      type="button"
      className={'setup-btn' + (selected ? ' selected' : '')}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export function SetupScreen({ onStart }) {
  const [language, setLanguage] = useState(null);
  const [mode, setMode] = useState(null);
  const [cards, setCards] = useState(null);
  const ready = language !== null && mode !== null && cards !== null;

  return (
    <div className="setup-screen">
      <div className="setup-card">
        <TitleBar label="S.00. STUDY HALL SETUP" />
        <div className="setup-body">
          <div className="setup-inner">
            <h1 className="pixel">WELCOME TO<br />STUDY HALL</h1>

            <div className="setup-question">
              <div className="setup-label">CHOOSE YOUR LANGUAGE</div>
              <div className="setup-choices setup-lang-choices">
                <SetupBtn selected={language === 'english'} onClick={() => setLanguage('english')}>
                  English
                </SetupBtn>
                <div className="setup-lang-col">
                  <SetupBtn selected={language === 'spanish'} onClick={() => setLanguage('spanish')}>
                    Spanish
                  </SetupBtn>
                  <div className="setup-lang-caption">
                    Translated by Mariana Gonzales and Jose Alberto Nevarez (UABC - Mexico)
                  </div>
                </div>
              </div>
            </div>

            <div className="setup-question">
              <div className="setup-label">MODE</div>
              <div className="setup-choices setup-mode-choices">
                <div className="setup-lang-col">
                  <SetupBtn selected={mode === 'simulation'} onClick={() => setMode('simulation')}>
                    Simulation Mode
                  </SetupBtn>
                  <div className="setup-lang-caption">Timed game setting</div>
                </div>
                <div className="setup-lang-col">
                  <SetupBtn selected={mode === 'study'} onClick={() => setMode('study')}>
                    Study Mode
                  </SetupBtn>
                  <div className="setup-lang-caption">See answers as you go. No rush go at your own pace</div>
                </div>
              </div>
            </div>

            <div className="setup-question">
              <div className="setup-label">NUMBER OF CARDS</div>
              <div className="setup-choices">
                {[5, 10, 20].map((n) => (
                  <SetupBtn key={n} selected={cards === n} onClick={() => setCards(n)}>
                    {n}
                  </SetupBtn>
                ))}
              </div>
            </div>

            <button
              type="button"
              className="restart-btn restart-btn--big setup-start-btn"
              disabled={!ready}
              onClick={() => onStart({ language, mode, cards })}
            >
              Start Game
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
