// Supplementary reading for the Learn More panel, one list per scenario.
//
// Lifted from the team's reference sheet -- the CSV export drops the cell
// hyperlinks, so these came from the sheet's HTML export, where the <a href>
// survives. Titles are the sheet's own link text; where a cell held only a
// bare URL the domain stands in.
//
// `blurb` is deliberately empty: the sheet carries no descriptions, and a
// made-up one is worse than none. Fill them in as they are written.
export const SCENARIO_RESOURCES = {
  // Card 1
  'S.01': [
    {
      title: 'Unmasking AI by Joy Buolamwini: 9780593241844 | PenguinRandomHouse.com: Books',
      url: 'https://www.penguinrandomhouse.com/books/670356/unmasking-ai-by-dr-joy-buolamwini/',
      domain: 'penguinrandomhouse.com',
      blurb: '',
    },
  ],
  // Card 2
  'S.02': [
    {
      title: 'book and guidance for co-design',
      url: 'https://www.beyondstickynotes.com/',
      domain: 'beyondstickynotes.com',
      blurb: '',
    },
  ],
  // Card 3
  'S.03': [
    {
      title: 'Rebecca Adamson: "Enoughness: Indigenous Economics 101" - YouTube',
      url: 'https://www.youtube.com/watch?v=hWTA69MHGpA',
      domain: 'youtube.com',
      blurb: '',
    },
  ],
  // Card 4
  'S.04': [
    {
      title: 'kanaeokana.net',
      url: 'https://kanaeokana.net/militarism',
      domain: 'kanaeokana.net',
      blurb: '',
    },
    {
      title: 'theguardian.com',
      url: 'https://www.theguardian.com/world/2025/aug/06/microsoft-israeli-military-palestinian-phone-calls-cloud',
      domain: 'theguardian.com',
      blurb: '',
    },
  ],
  // Cards 5 and 18
  'S.05': [
    {
      title: 'Sociocracy Primer',
      url: 'https://sociocracyprimer.sutra.co/space/vxjpl9/content',
      domain: 'sociocracyprimer.sutra.co',
      blurb: '',
    },
    {
      title: 'ostrom_1990.pdf',
      url: 'https://www.actu-environnement.com/media/pdf/ostrom_1990.pdf',
      domain: 'actu-environnement.com',
      blurb: '',
    },
  ],
};
