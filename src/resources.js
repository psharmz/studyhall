// Supplementary reading for the Learn More panel, one list per scenario.
//
// Lifted from the team's reference sheet -- the CSV export drops the cell
// hyperlinks, so these came from the sheet's HTML export, where the <a href>
// survives. Titles are the sheet's own link text; where a cell held only a
// bare URL the domain stands in.
//
// `blurb` is deliberately empty: the sheet carries no descriptions, and a
// made-up one is worse than none. Fill them in as they are written.
// Column A of the sheet ("Environmental Justice in Tech"): background reading
// that is not tied to any one card. Shown at the foot of every Learn More
// panel, under its own heading, after that scenario's own list.
export const GENERAL_RESOURCES = [
  {
    title: 'Principles for Environmental Justice in Technology: Toward a Regenerative Future',
    url: 'https://arxiv.org/html/2508.09007v1',
    domain: 'arxiv.org',
    blurb: '',
  },
  {
    title: 'Critical Technical Awakenings | TUP Journals & Magazine | IEEE Xplore',
    url: 'https://ieeexplore.ieee.org/document/9698152',
    domain: 'ieeexplore.ieee.org',
    blurb: '',
  },
  {
    title: 'Environmental Justice - an overview | ScienceDirect Topics',
    url: 'https://www.sciencedirect.com/topics/earth-and-planetary-sciences/environmental-justice#definition',
    domain: 'sciencedirect.com',
    blurb: '',
  },
  {
    title: 'DEFINING ENVIRONMENTAL JUSTICE AND ENVIRONMENTAL RACISM1',
    url: 'https://www.nypl.org/sites/default/files/holifield_defining_ej_and_environmental_racism.pdf',
    domain: 'nypl.org',
    blurb: '',
  },
];

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
  // Card 5 -- shares a column with the rest of "Cards 5 and 18"
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
  // Card 6
  'S.06': [
    {
      title: 'ESG Explained: Socially Conscious Capitalism and Its Backlash',
      url: 'https://www.youtube.com/watch?v=-WVdP9ssU2o',
      domain: 'youtube.com',
      blurb: '',
    },
    {
      title: 'The Shock Doctrine [2009] Documentary by Naomi Klein - YouTube',
      url: 'https://www.youtube.com/watch?v=B3B5qt6gsxY',
      domain: 'youtube.com',
      blurb: '',
    },
    {
      title: 'bcorporation.net',
      url: 'https://www.bcorporation.net/en-us/',
      domain: 'bcorporation.net',
      blurb: '',
    },
    {
      title: 'The Problem with B Corp ‘Conscious Capitalism’ - Dame Magazine',
      url: 'https://www.damemagazine.com/2022/05/13/the-problem-with-b-corp-conscious-capitalism/',
      domain: 'damemagazine.com',
      blurb: '',
    },
    {
      title: 'Who bears the burden of climate inaction? | Brookings',
      url: 'https://www.brookings.edu/articles/who-bears-the-burden-of-climate-inaction/',
      domain: 'brookings.edu',
      blurb: '',
    },
    {
      title: 'OpenAI Reverses Course, Says Its Nonprofit Will Continue to Control Business',
      url: 'https://broadbandbreakfast.com/openai-reverses-course-says-its-nonprofit-will-continue-to-control-business/',
      domain: 'broadbandbreakfast.com',
      blurb: '',
    },
    {
      title: 'The Economics of Climate Change | Steve Keen - YouTube',
      url: 'https://www.youtube.com/watch?v=sK12oB90zeQ',
      domain: 'youtube.com',
      blurb: '',
    },
    {
      title: 'What Doughnut Economics Can Learn From History | Roman Krznaric & Kate Raworth',
      url: 'https://www.youtube.com/watch?v=FfUOs4ZJ1wM',
      domain: 'youtube.com',
      blurb: '',
    },
    {
      title: 'tandfonline.com',
      url: 'https://www.tandfonline.com/doi/epdf/10.1080/09538259.2025.2524265?needAccess=true',
      domain: 'tandfonline.com',
      blurb: '',
    },
  ],
  // Card 7 -- shares a column with the rest of "Cards 7 and 9"
  'S.07': [
    {
      title: 'traumainformedhousing.poah.org',
      url: 'https://traumainformedhousing.poah.org/what-is-trauma-informed-design',
      domain: 'traumainformedhousing.poah.org',
      blurb: '',
    },
  ],
  // Card 8
  'S.08': [
    {
      title: 'Biomimicry - YouTube',
      url: 'https://www.youtube.com/watch?v=sf4oW8OtaPY',
      domain: 'youtube.com',
      blurb: '',
    },
  ],
  // Card 9 -- shares a column with the rest of "Cards 7 and 9"
  'S.09': [
    {
      title: 'traumainformedhousing.poah.org',
      url: 'https://traumainformedhousing.poah.org/what-is-trauma-informed-design',
      domain: 'traumainformedhousing.poah.org',
      blurb: '',
    },
  ],
  // Card 11
  'S.11': [
    {
      title: 'Thomas Sowell - "Trickle Down" Theory',
      url: 'https://www.youtube.com/watch?v=nZPDpk8NA-g',
      domain: 'youtube.com',
      blurb: '',
    },
  ],
  // Card 13
  'S.13': [
    {
      title: 'Justice: What\'s The Right Thing To Do? Episode 01 "THE MORAL SIDE OF MURDER"',
      url: 'https://www.youtube.com/watch?v=kBdfcR-8hEY',
      domain: 'youtube.com',
      blurb: '',
    },
  ],
  // Card 15 -- shares a column with the rest of "Cards 15 and 19"
  'S.15': [
    {
      title: 'A History of Indigenous Women with Lily Gladstone: Ep 19 of Crash Course Native American History - YouTube',
      url: 'https://www.youtube.com/watch?v=Dj8EjBQJD84',
      domain: 'youtube.com',
      blurb: '',
    },
    {
      title: 'Rebecca Adamson: "Enoughness: Indigenous Economics 101" - YouTube',
      url: 'https://www.youtube.com/watch?v=hWTA69MHGpA',
      domain: 'youtube.com',
      blurb: '',
    },
  ],
  // Card 16
  'S.16': [
    {
      title: 'The Consilience Project | Technology is Not Values Neutral: Ending the Reign of Nihilistic Design - The Consilience Project',
      url: 'https://consilienceproject.org/technology-is-not-values-neutral-ending-the-reign-of-nihilistic-design-2/',
      domain: 'consilienceproject.org',
      blurb: '',
    },
    {
      title: '[Official Release]The Superior Human?-2012 documentary[Green|Animal Rights|Speciesism]',
      url: 'https://www.youtube.com/watch?v=mqT82oGeax0',
      domain: 'youtube.com',
      blurb: '',
    },
  ],
  // Card 17
  'S.17': [
    {
      title: 'Carbon Inequality - Global Inequality',
      url: 'https://globalinequality.org/carbon-inequality/',
      domain: 'globalinequality.org',
      blurb: '',
    },
    {
      title: 'Smartphones: It’s Time to Confront Our Global Addiction | Dr. Justin Romano | TEDxOmaha',
      url: 'https://www.youtube.com/watch?v=2ldLwkj4dRc',
      domain: 'youtube.com',
      blurb: '',
    },
    {
      title: 'THE TRAUMA OF TECHNOLOGY | Thomas Hübl | TEDxMarin - YouTube',
      url: 'https://www.youtube.com/watch?v=slHhmQvKIFY',
      domain: 'youtube.com',
      blurb: '',
    },
    {
      title: 'Trauma-Informed Computing: Towards Safer Technology Experiences for All - YouTube',
      url: 'https://youtu.be/sF05FsOwF28',
      domain: 'youtu.be',
      blurb: '',
    },
  ],
  // Card 18 -- shares a column with the rest of "Cards 5 and 18"
  'S.18': [
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
  // Card 19 -- shares a column with the rest of "Cards 15 and 19"
  'S.19': [
    {
      title: 'A History of Indigenous Women with Lily Gladstone: Ep 19 of Crash Course Native American History - YouTube',
      url: 'https://www.youtube.com/watch?v=Dj8EjBQJD84',
      domain: 'youtube.com',
      blurb: '',
    },
    {
      title: 'Rebecca Adamson: "Enoughness: Indigenous Economics 101" - YouTube',
      url: 'https://www.youtube.com/watch?v=hWTA69MHGpA',
      domain: 'youtube.com',
      blurb: '',
    },
  ],
};
