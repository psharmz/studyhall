import { useState } from 'react';
import { DEV_DECK } from '../scenarios.js';
import { TitleBar } from './TitleBar.jsx';

// `note` marks a choice that cannot be taken yet: the button is disabled and
// says why in its top corner, rather than being left clickable or removed
// altogether -- what is coming, or what would unlock it, is worth advertising.
// The note is taken out of the flow so the button's own label stays centred
// whether or not there is one; a label that shifts when a note appears makes
// the row of buttons look mismatched.
function SetupBtn({ selected, onClick, children, disabled = false, note = null, tooltip = null }) {
  const button = (
    <button
      type="button"
      className={'setup-btn' + (selected ? ' selected' : '') + (disabled ? ' is-disabled' : '')}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
      {note && <span className="setup-btn-note">{note}</span>}
    </button>
  );
  if (!tooltip) return button;
  // The hover has to be caught by a wrapper rather than the button: a disabled
  // button fires no pointer events and never matches :hover, so a tooltip hung
  // off the button itself would never appear -- which is exactly the case that
  // needs explaining. Only wrapped when there is a tooltip, so the buttons
  // without one keep their place in their parent's layout.
  return (
    <span className="setup-btn-wrap">
      {button}
      <span className="setup-btn-tooltip" role="tooltip">
        {tooltip}
      </span>
    </span>
  );
}

// Setup-screen copy per language. Falls back to english until a language is picked.
const STRINGS = {
  english: {
    titleBar: 'S.00. STUDY HALL SETUP',
    welcome: ['WELCOME TO', 'STUDY HALL'],
    languageLabel: 'CHOOSE YOUR LANGUAGE',
    english: 'English',
    spanish: 'Español',
    comingSoon: 'Coming soon!',
    studyLockedTip: 'Unlock study mode by playing simulation mode first',
    translators: 'Translated by Mariana González-Cepeda and Jose Alberto Nevarez (UABC - Mexico)',
    modeLabel: 'MODE',
    simulation: 'Simulation Mode',
    simulationCaption: 'Timed game setting',
    study: 'Study Mode',
    studyCaption: 'See answers as you go. No rush go at your own pace',
    soundLabel: 'SOUND',
    on: 'On',
    off: 'Off',
    cardsLabel: 'NUMBER OF CARDS',
    start: 'Start Game',
  },
  spanish: {
    titleBar: 'S.00. CONFIGURACIÓN DE STUDY HALL',
    welcome: ['BIENVENIDO A', 'STUDY HALL'],
    languageLabel: 'ELIGE TU IDIOMA',
    // Each language button names itself in its own language, so "English"
    // stays "English" here rather than becoming "Inglés".
    english: 'English',
    spanish: 'Español',
    comingSoon: '¡Próximamente!',
    studyLockedTip: 'Desbloquea el modo estudio jugando primero el modo simulación',
    translators: 'Traducido por Mariana González-Cepeda y Jose Alberto Nevarez (UABC - México)',
    modeLabel: 'MODO',
    simulation: 'Modo Simulación',
    simulationCaption: 'Juego con tiempo límite',
    study: 'Modo Estudio',
    studyCaption: 'Ve las respuestas mientras avanzas. Sin prisa, a tu propio ritmo',
    soundLabel: 'SONIDO',
    on: 'Encendido',
    off: 'Apagado',
    cardsLabel: 'NÚMERO DE TARJETAS',
    start: 'Comenzar Juego',
  },
};

// `initial` restores the previous picks when the player comes back from the
// rules screen, so Back never wipes what they already chose.
//
// `dev` is Dev Mode: the deck is fixed at four cards there, so the only count
// on offer is that one, already chosen -- there is nothing to decide, and it
// keeps the run from starting on a promise of ten cards it will not deal.
// `studyUnlocked` is set once this browser has played a Simulation run to the
// end. Study Mode debriefs that run, so until there is one it is shown and
// held rather than hidden. Dev Mode ignores the gate -- it exists to reach
// every screen without playing through first.
export function SetupScreen({ onStart, initial, dev = false, studyUnlocked = false }) {
  // Ten cards is not dealt yet; twenty is the whole deck. Dev Mode plays its
  // own short deck instead.
  const cardChoices = dev ? [DEV_DECK.length] : [10, 20];
  const lockedCards = dev ? [] : [10];
  const studyLocked = !dev && !studyUnlocked;
  const [language, setLanguage] = useState(initial?.language ?? null);
  const [mode, setMode] = useState(initial?.mode ?? null);
  const [cards, setCards] = useState(initial?.cards ?? (dev ? DEV_DECK.length : null));
  // Sound defaults to on, so it never blocks Start Game
  const [sound, setSound] = useState(initial?.sound ?? true);
  const ready = language !== null && mode !== null && cards !== null;
  const t = STRINGS[language] ?? STRINGS.english;

  return (
    <div className="setup-screen">
      <div className="setup-card">
        <TitleBar label={dev ? `${t.titleBar} [DEV]` : t.titleBar} />
        <div className="setup-body">
          <div className="setup-inner">
            <h1 className="pixel">{t.welcome[0]}<br />{t.welcome[1]}</h1>

            <div className="setup-question">
              <div className="setup-label">{t.languageLabel}</div>
              <div className="setup-choices setup-lang-choices">
                <SetupBtn selected={language === 'english'} onClick={() => setLanguage('english')}>
                  {t.english}
                </SetupBtn>
                <div className="setup-lang-col">
                  {/* The translation is done but not wired through the game
                      yet, so the choice is shown and held rather than hidden. */}
                  <SetupBtn selected={false} disabled note={t.comingSoon}>
                    {t.spanish}
                  </SetupBtn>
                  <div className="setup-lang-caption">
                    {t.translators}
                  </div>
                </div>
              </div>
            </div>

            <div className="setup-question">
              <div className="setup-label">{t.modeLabel}</div>
              <div className="setup-choices setup-mode-choices">
                <div className="setup-lang-col">
                  <SetupBtn selected={mode === 'simulation'} onClick={() => setMode('simulation')}>
                    {t.simulation}
                  </SetupBtn>
                  <div className="setup-lang-caption">{t.simulationCaption}</div>
                </div>
                <div className="setup-lang-col">
                  <SetupBtn
                    selected={mode === 'study'}
                    onClick={() => setMode('study')}
                    disabled={studyLocked}
                    tooltip={studyLocked ? t.studyLockedTip : null}
                  >
                    <span className="setup-btn-icon">🔒</span>{t.study}
                  </SetupBtn>
                  <div className="setup-lang-caption">{t.studyCaption}</div>
                </div>
              </div>
            </div>

            <div className="setup-question">
              <div className="setup-label">{t.soundLabel}</div>
              <div className="setup-choices">
                <SetupBtn selected={sound} onClick={() => setSound(true)}>
                  {t.on}
                </SetupBtn>
                <SetupBtn selected={!sound} onClick={() => setSound(false)}>
                  {t.off}
                </SetupBtn>
              </div>
            </div>

            <div className="setup-question">
              <div className="setup-label">{t.cardsLabel}</div>
              <div className="setup-choices">
                {cardChoices.map((n) => {
                  const locked = lockedCards.includes(n);
                  return (
                    <SetupBtn
                      key={n}
                      selected={cards === n}
                      onClick={() => setCards(n)}
                      disabled={locked}
                      note={locked ? t.comingSoon : null}
                    >
                      {n}
                    </SetupBtn>
                  );
                })}
              </div>
            </div>

            <button
              type="button"
              className="restart-btn restart-btn--big setup-start-btn"
              disabled={!ready}
              onClick={() => onStart({ language, mode, cards, sound })}
            >
              {t.start}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
