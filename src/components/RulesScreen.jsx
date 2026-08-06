import { InfoScreen } from './InfoScreen.jsx';

const RULES_PARAGRAPHS = [
  'In this simulation, you will be faced with a series of scenarios that will put to the test your current comprehension of the impacts of technology in our society and environment.',
  'We will take you on a journey that starts with you as an intern in a tech startup and ends 20 years later with you in positions of power. And as time passes and you gain more power, the scenarios will become more complicated.',
  'In this world everything moves fast, leaving many things broken. Here, you will also be faced with this time pressure and you will have 1.5min to choose an answer.',
  'Finally, if you are in doubt you can call one of your advisors. But keep in mind that everyone has a unique bias. So, stay critical.',
];

export function RulesScreen({ onBack, onNext }) {
  return (
    <InfoScreen
      label="S.01. HOW TO PLAY"
      heading={['WELCOME TO', 'STUDY HALL!']}
      paragraphs={RULES_PARAGRAPHS}
      onBack={onBack}
      onNext={onNext}
    />
  );
}
