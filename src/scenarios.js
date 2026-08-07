// Alignment/scoring sourced from the EJIT debrief sheets for each
// scenario: full = +3, partial = +1, non = -2.
export const LETTERS = ['A', 'B', 'C', 'D', 'E'];

export const ALIGN_LABELS = { full: 'Fully aligned', partial: 'Partially aligned', non: 'Non-aligned' };

// Flip to false to hide every advisor's role line without touching the copy.
export const SHOW_ADVISOR_ROLE = true;

// Each advisor's standing position, shown under their role in the call
// bubble. `tone` keys into the gauge's own band colours -- non = red,
// partial = yellow, full = green -- so the bias reads before the quote does.
export const ADVISOR_PROFILES = {
  'Tech Entrepreneur': {
    motto: '“if companies do well, the world also does well.”',
    tone: 'non',
  },
  'Public Policy Expert': {
    motto: '“change is needed but revolutions rarely ended well.”',
    tone: 'partial',
  },
  'Community Leader': {
    motto:
      '“revolution already happened but for the minority. It is time to do again for the majority.”',
    tone: 'full',
  },
};

// Each scenario has three advisors, one per phone icon. Roles are optional
// (see SHOW_ADVISOR_ROLE); quotes are what the bubble types out.
const PLACEHOLDER_ADVISORS = [
  { role: 'Advisor 1', quote: 'placeholder text' },
  { role: 'Advisor 2', quote: 'placeholder text' },
  { role: 'Advisor 3', quote: 'placeholder text' },
];

export const SCENARIOS = [
  {
    code: 'S.01',
    titleLines: ['DAY 1 AT', 'TECH FLOW'],
    paragraphs: [
      'It\'s your first day at TechFlow, a promising startup developing AI solutions. During orientation, you learn the company is working on an AI hiring system for major corporations. Your new manager, Sarah, pulls you aside in an attempt to test some of your critical thinking: "We need fresh perspectives on this project. The hiring AI has been flagging certain resumes less favorably, and we\'re not sure why." How do you think we should approach this?'
    ],
    advisors: [
      {
        role: 'Public Policy Expert',
        quote: 'Every society should be based on respecting each other! More importantly, people want changes right now! Think about it, when you are hungry all you want is to eat, you do not care where your food comes from or how to plant or cook.'
      },
      {
        role: 'Community Leader',
        quote: 'It is always the same...things are built for us without us and guess what?! They end up harming us...classic.'
      },
      {
        role: 'Tech Entrepreneur',
        quote: 'Look, progress is messy, ok? But we need to keep on moving forward. Innovation is always built by standing on the shoulders of giants. It is never about climbing down to see from floor.'
      }
    ],
    options: [
      { text: 'Suggest focusing on removing bias from the existing datasets and algorithms.', score: 1, align: 'partial', explanation: 'A good start, but this approach treats symptoms rather than addressing the root systems that created these biases.' },
      { text: 'Recommend centering anti-racist principles from the ground up and involving affected communities in the redesign.', score: 3, align: 'full', explanation: 'This approach recognizes that truly just technology must actively dismantle racist systems, not just minimize their effects.' },
      { text: 'Propose making the AI completely colorblind by removing all demographic indicators.', score: -2, align: 'non', explanation: 'Colorblind approaches often perpetuate existing inequalities by ignoring the reality of already existing systemic discrimination. It artificially removes aspects that are relevant to the issue' },
      { text: 'Recommend implementing quota systems to ensure equal hiring outcomes.', score: 1, align: 'partial', explanation: 'Quotas are relevant to address the symptoms but, by themselves, do not fix the biased processes and systemic issues that create unequal results in the first place.' },
      { text: 'Suggest training the AI on data from the most successful companies in the industry.', score: -2, align: 'non', explanation: 'In systems of exploitation, historical success often reflects past discrimination, making this approach potentially harmful to marginalized communities.' }
    ]
  },
  {
    code: 'S.02',
    titleLines: ['INNOVATION', 'CHALLENGE'],
    paragraphs: [
      'It has been a few months now and your manager invites you to join a special \'Innovation Sprint\' team. \'We\'re under pressure from the CEO and investors to improve our brand image. We need to launch at least one breakthrough product this quarter that can help marginalized, communities,\' she explains. \'Speed is everything in this market since there is little investment.\' As the team gathers for the first meeting, the room buzzes with excitement about rapid prototyping and fast launches.',
      'How do you guide the team\'s approach to innovation?'
    ],
    advisors: [
      {
        role: 'Public Policy Expert',
        quote: 'Do you know what make people feel included? Invite them to a conversation and just listen to them. Having additional data is also good so you can explain to them what you are doing. You will filter their suggestions, of course. At the end, the business is still yours.'
      },
      {
        role: 'Community Leader',
        quote: 'You know what is funny? My ancestors have lived in these lands for thousands of years and we were doing very well, thanks. What you call innovation to us, is your attempt to benefit and profit from the problems you created, which will create more problems and go on like this.'
      },
      {
        role: 'Tech Entrepreneur',
        quote: 'Who do you think better understands your own business: yourself or one of those blood-sucker politicians? Everyone wants a piece of the pie, so you better move fast before someone take yours.'
      }
    ],
    options: [
      { text: 'Embrace the fast-paced culture and focus on rapid iteration to stay competitive.', score: -2, align: 'non', explanation: 'Prioritizing speed often means overlooking critical ethical considerations and community impacts that take time to understand.' },
      { text: 'Recommend following established industry best practices and ensuring regulatory compliance.', score: -2, align: 'non', explanation: 'Compliance represents minimum standards that often don\'t address environmental justice concerns or community needs.' },
      { text: 'Propose forming diverse review committees to evaluate products before launch.', score: 1, align: 'partial', explanation: 'Diversity in review helps, but it\'s insufficient without fundamental changes to how innovation processes work from the start.' },
      { text: 'Suggest conducting thorough market research and user testing before any release.', score: 1, align: 'partial', explanation: 'Traditional research is useful but doesn\'t address deeper questions about who gets to innovate or broader systemic impacts.' },
      { text: 'Advocate for providing resources for all to innovate, considering potential unintended consequences, and centering empathy in every decision.', score: 3, align: 'full', explanation: 'True responsible innovation requires considering broad access, unintended consequences, and human-centered design at every step.' }
    ]
  },
  {
    code: 'S.03',
    titleLines: ['COMMUNITY', 'VISIT'],
    paragraphs: [
      'Your innovation approach has gained respect within TechFlow. The company decides it is time for you to jump into a real project from the start and the \'Digital Villages\' platform for rural and indigenous communities seems to be the right fit. You\'re chosen to lead the community engagement for a potential pilot site - a small Indigenous community in Montana. During your visit, you meet with community elders who listen politely to your presentation but then Elder Mary speaks up: \'We appreciate you coming here, but our people have lived well for generations without these digital tools. We\'d prefer to keep our traditional ways.\' How do you respond?'
    ],
    advisors: [
      {
        role: 'Public Policy Expert',
        quote: 'People offer resistance to progress because of their lack of education. But education is not just providing information. Education is an accessible process that helps people understand your message.'
      },
      {
        role: 'Community Leader',
        quote: 'There are lots of talks about freedom, but what freedom is that which does not accept our owns decisions? Who’s actually free in such a society?'
      },
      {
        role: 'Tech Entrepreneur',
        quote: 'Here is something for you to always have in mind: people do not know what they want or need. If you believe in what you are doing, then it is up to you to convince people and to find the path of least resistance to adoption.'
      }
    ],
    options: [
      { text: 'Present more detailed information about the platform\'s benefits to help them make a fully informed decision.', score: -2, align: 'non', explanation: 'This assumes they lack information rather than respecting their autonomy to maintain their traditional way of life' },
      { text: 'Suggest free comprehensive digital literacy training with TechFlow platform only as an option, so they can make a truly fully informed choice.', score: 1, align: 'partial', explanation: 'While education can be valuable, this still assumes technology adoption is inherently beneficial and desirable.' },
      { text: 'Offer to provide only basic, essential digital services while avoiding advanced features.', score: -2, align: 'non', explanation: 'This still imposes technology on a community that has clearly expressed they don\'t want it.' },
      { text: 'Respect their choice completely and advocate within TechFlow to protect their right to live without digital interference.', score: 3, align: 'full', explanation: 'Environmental justice demands preserving Indigenous and traditional ways of living without technological interference.' },
      { text: 'Explain that digital integration is inevitable in the modern world and offer gradual transition support.', score: -2, align: 'non', explanation: 'This paternalistic approach assumes communities need to \'adapt\' rather than respecting their autonomous choices.' }
    ]
  },
  {
    code: 'S.04',
    titleLines: ['WORKING WITH', 'THE GOV.'],
    paragraphs: [
      'Your experience with the Montana situation earns you an opportunity to work with a small but high impact team of Ethical Technology. Six months into your new role, TechFlow receives a lucrative government contract offer and that might be the chance you were looking for to show the importance of your work at national scale. You are surprised by a Department of Defense representative that explains: \'We need surveillance technology that can monitor both civilian areas for safety and military zones for security. Your company\'s AI capabilities are exactly what we need. This contract could fund your social impact projects for the next five years.\' The board is excited about the funding potential and even offered you the role of Director if you get this right. What\'s your recommendation?'
    ],
    advisors: [
      {
        role: 'Public Policy Expert',
        quote: 'Internal and domestic safety should be treated differently. We should always strive for diplomatic relationships with other countries while ensuring domestic unity.'
      },
      {
        role: 'Community Leader',
        quote: 'For how long more we will pretend that wars and the excessive military investment is really for the good of society? The very idea of a standing and ready to fight army speaks a lot more about fear than bravery.'
      },
      {
        role: 'Tech Entrepreneur',
        quote: 'Peace in this world only comes by demonstration of force. Sure, you do not have to take the offensive stance but your defense should scare the offense of any potential enemy.'
      }
    ],
    options: [
      { text: 'Accept the contract since the civilian safety applications outweigh the military concerns.', score: -2, align: 'non', explanation: 'Environmental justice technology explicitly refuses to cooperate with systems of oppression, regardless of potential benefits.' },
      { text: 'Negotiate to accept only if military applications are strictly limited to defensive purposes.', score: -2, align: 'non', explanation: 'The distinction between \'defensive\' and \'offensive\' use is often unclear and still supports systems of potential violence.' },
      { text: 'Decline the entire project due to concerns with weaponization of intelligent systems and civilian monitoring as enablement of systems of oppression.', score: 3, align: 'full', explanation: 'True environmental justice demands that technology elevate all people, not enable surveillance, violence, or oppression.' },
      { text: 'Accept the contract if it demonstrably helps prevent greater harm and violence.', score: -2, align: 'non', explanation: 'This utilitarian logic can be used to justify any harmful application and contradicts environmental justice values.' },
      { text: 'Propose separating civilian and military applications, only developing the civilian safety components.', score: 1, align: 'partial', explanation: 'While better than full military cooperation, this still doesn\'t address broader concerns about surveillance systems.' }
    ]
  },
  {
    code: 'S.05',
    titleLines: ['CITY', 'PARTNERSHIP'],
    paragraphs: [
      'Your military contract showed to be too risky, and you ultimately gained the support of the board by presenting alternative revenue streams. Now, TechFlow partners with the city of Portland to deploy smart city infrastructure. The mayor\'s office wants to move quickly, but community activists contact you directly: \'We\'re concerned about decisions being made about our neighborhoods without real community input.\' You\'re tasked with designing the community engagement process. What do you propose?'
    ],
    advisors: [
      {
        role: 'Public Policy Expert',
        quote: 'Democracy is necessary for the progress of any nation. But for democracy to exist we need an inclusive process where representatives of every corner of the nation can share their dreams. Only then, our leaders will be well-informed to make the right decisions towards a common future.'
      },
      {
        role: 'Community Leader',
        quote: 'Here is something simple to understand, we are tired of hearing that you want to “give us a voice”. We have a voice. We always had one. In fact, we feel sometimes that we spoke a lot already. What we need is power to make things happen. Give us the means and let’s us do it and maybe you will actually learn a thing or two about us.'
      },
      {
        role: 'Tech Entrepreneur',
        quote: 'From one extreme to the other of the political spectrum, one thing we all agree is that people are different. The illusion is to think one can find consensus among all these differences. This is not to say that you shouldn’t let them voice their concerns or inform people about what you are doing. A true leader decides for all and understands the weight of such a responsibility.'
      }
    ],
    options: [
      { text: 'Organize comprehensive community surveys, workshops and feedback sessions to gather input.', score: 1, align: 'partial', explanation: 'While community feedback is valuable, this doesn\'t give residents actual power in the decision-making process.' },
      { text: 'Establish regular public meetings where community members can voice concerns and ask questions.', score: -2, align: 'non', explanation: 'Public comment opportunities without real decision power don\'t constitute meaningful democratic participation.' },
      { text: 'Create transparent development processes with regular public updates and information sessions.', score: -2, align: 'non', explanation: 'Transparency is important but by itself doesn\'t give communities actual decision-making authority over their futures.' },
      { text: 'Design a system where affected communities are informed and have real decision-making power over technologies that impact their neighborhoods.', score: 3, align: 'full', explanation: 'True democratic technology development requires communities to have actual authority, not just opportunities for consultation.' },
      { text: 'Form community advisory boards with neighborhood representatives to guide implementation of all technologies and systems.', score: 1, align: 'partial', explanation: 'Advisory roles provide some influence but don\'t ensure community control over decisions that directly affect them.' }
    ]
  }
];

// Gauge is cumulative across every scenario: -2..+3 per question.
export const SCORE_MIN = SCENARIOS.length * -2;
export const SCORE_MAX = SCENARIOS.length * 3;
