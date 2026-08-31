// Alignment sourced from the EJIT debrief sheets for each
// scenario; the score each alignment is worth: full = 5, partial = 2, non = 0.
export const LETTERS = ['A', 'B', 'C', 'D', 'E'];

// Where the secondary actions point. The nulls have no destination yet --
// until they get one, those buttons render inert.
export const FEEDBACK_FORM_URL = 'https://docs.google.com/forms/u/0/';
export const LEARN_BEYOND_URL = null;
export const FACILITATOR_FORM_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSct92R0RfomYZMXI32iA9jYQCbD-zJQLvWk_vL1rLkAg5bXEw/viewform?usp=header';
export const SUPPORT_URL = null;

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
    principle: 'Environmentally just technology is explicitly anti-racist.',
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
      { text: 'Suggest focusing on removing bias from the existing datasets and algorithms.', score: 2, align: 'partial', explanation: 'A good start, but this approach treats symptoms rather than addressing the root systems that created these biases.' },
      { text: 'Recommend centering anti-racist principles from the ground up and involving affected communities in the redesign.', score: 5, align: 'full', explanation: 'This approach recognizes that truly just technology must actively dismantle racist systems, not just minimize their effects.' },
      { text: 'Propose making the AI completely colorblind by removing all demographic indicators.', score: 0, align: 'non', explanation: 'Colorblind approaches often perpetuate existing inequalities by ignoring the reality of already existing systemic discrimination. It artificially removes aspects that are relevant to the issue' },
      { text: 'Recommend implementing quota systems to ensure equal hiring outcomes.', score: 2, align: 'partial', explanation: 'Quotas are relevant to address the symptoms but, by themselves, do not fix the biased processes and systemic issues that create unequal results in the first place.' },
      { text: 'Suggest training the AI on data from the most successful companies in the industry.', score: 0, align: 'non', explanation: 'In systems of exploitation, historical success often reflects past discrimination, making this approach potentially harmful to marginalized communities.' }
    ]
  },
  {
    code: 'S.02',
    titleLines: ['INNOVATION', 'CHALLENGE'],
    principle: 'Environmental justice in technology calls for responsible innovation in every aspect of technological creation. Responsible innovation occurs when: all people are provided the resources to innovate; all potential uses of the innovation are accounted for to prepare for contingencies; empathy is central to innovation and its creative intent.',
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
      { text: 'Embrace the fast-paced culture and focus on rapid iteration to stay competitive.', score: 0, align: 'non', explanation: 'Prioritizing speed often means overlooking critical ethical considerations and community impacts that take time to understand.' },
      { text: 'Recommend following established industry best practices and ensuring regulatory compliance.', score: 0, align: 'non', explanation: 'Compliance represents minimum standards that often don\'t address environmental justice concerns or community needs.' },
      { text: 'Propose forming diverse review committees to evaluate products before launch.', score: 2, align: 'partial', explanation: 'Diversity in review helps, but it\'s insufficient without fundamental changes to how innovation processes work from the start.' },
      { text: 'Suggest conducting thorough market research and user testing before any release.', score: 2, align: 'partial', explanation: 'Traditional research is useful but doesn\'t address deeper questions about who gets to innovate or broader systemic impacts.' },
      { text: 'Advocate for providing resources for all to innovate, considering potential unintended consequences, and centering empathy in every decision.', score: 5, align: 'full', explanation: 'True responsible innovation requires considering broad access, unintended consequences, and human-centered design at every step.' }
    ]
  },
  {
    code: 'S.03',
    titleLines: ['COMMUNITY', 'VISIT'],
    principle: 'Environmental justice in technology empowers those who wish to live without certain technologies. It demands preserving traditional Indigenous ways of living without interference from capitalist and corporate technologies.',
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
      { text: 'Present more detailed information about the platform\'s benefits to help them make a fully informed decision.', score: 0, align: 'non', explanation: 'This assumes they lack information rather than respecting their autonomy to maintain their traditional way of life' },
      { text: 'Suggest free comprehensive digital literacy training with TechFlow platform only as an option, so they can make a truly fully informed choice.', score: 2, align: 'partial', explanation: 'While education can be valuable, this still assumes technology adoption is inherently beneficial and desirable.' },
      { text: 'Offer to provide only basic, essential digital services while avoiding advanced features.', score: 0, align: 'non', explanation: 'This still imposes technology on a community that has clearly expressed they don\'t want it.' },
      { text: 'Respect their choice completely and advocate within TechFlow to protect their right to live without digital interference.', score: 5, align: 'full', explanation: 'Environmental justice demands preserving Indigenous and traditional ways of living without technological interference.' },
      { text: 'Explain that digital integration is inevitable in the modern world and offer gradual transition support.', score: 0, align: 'non', explanation: 'This paternalistic approach assumes communities need to \'adapt\' rather than respecting their autonomous choices.' }
    ]
  },
  {
    code: 'S.04',
    titleLines: ['WORKING WITH', 'THE GOV.'],
    principle: 'Environmental justice in tech means refusing to cooperate with or arm the military-industrial complex, prisons, or police. Environmentally just tech is used to elevate all ordinary people, not to oppress any of them with violence or the threat of it.',
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
      { text: 'Accept the contract since the civilian safety applications outweigh the military concerns.', score: 0, align: 'non', explanation: 'Environmental justice technology explicitly refuses to cooperate with systems of oppression, regardless of potential benefits.' },
      { text: 'Negotiate to accept only if military applications are strictly limited to defensive purposes.', score: 0, align: 'non', explanation: 'The distinction between \'defensive\' and \'offensive\' use is often unclear and still supports systems of potential violence.' },
      { text: 'Decline the entire project due to concerns with weaponization of intelligent systems and civilian monitoring as enablement of systems of oppression.', score: 5, align: 'full', explanation: 'True environmental justice demands that technology elevate all people, not enable surveillance, violence, or oppression.' },
      { text: 'Accept the contract if it demonstrably helps prevent greater harm and violence.', score: 0, align: 'non', explanation: 'This utilitarian logic can be used to justify any harmful application and contradicts environmental justice values.' },
      { text: 'Propose separating civilian and military applications, only developing the civilian safety components.', score: 2, align: 'partial', explanation: 'While better than full military cooperation, this still doesn\'t address broader concerns about surveillance systems.' }
    ]
  },
  {
    code: 'S.05',
    titleLines: ['CITY', 'PARTNERSHIP'],
    principle: 'Environmental justice in technology demands that democracy be the foundation of all of its endeavors. A democratic and community-centric environment is necessary to have a just world.',
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
      { text: 'Organize comprehensive community surveys, workshops and feedback sessions to gather input.', score: 2, align: 'partial', explanation: 'While community feedback is valuable, this doesn\'t give residents actual power in the decision-making process.' },
      { text: 'Establish regular public meetings where community members can voice concerns and ask questions.', score: 0, align: 'non', explanation: 'Public comment opportunities without real decision power don\'t constitute meaningful democratic participation.' },
      { text: 'Create transparent development processes with regular public updates and information sessions.', score: 0, align: 'non', explanation: 'Transparency is important but by itself doesn\'t give communities actual decision-making authority over their futures.' },
      { text: 'Design a system where affected communities are informed and have real decision-making power over technologies that impact their neighborhoods.', score: 5, align: 'full', explanation: 'True democratic technology development requires communities to have actual authority, not just opportunities for consultation.' },
      { text: 'Form community advisory boards with neighborhood representatives to guide implementation of all technologies and systems.', score: 2, align: 'partial', explanation: 'Advisory roles provide some influence but don\'t ensure community control over decisions that directly affect them.' }
    ]
  },
  {
    code: 'S.06',
    titleLines: ['MOVE FAST AND', 'BREAK THINGS'],
    principle: 'Environmentally just technology dismantles capitalist-centric development and does not harm economic vitality. It promotes equitable and just income (re)distribution across the world.',
    paragraphs: [
      'Portland\'s community-centered approach becomes a model that attracts national attention. However, this success brings new challenges. TechFlow\'s investors are pressuring for rapid expansion and higher profit margins. \'We need to scale fast and maximize returns,\' insists lead investor Jeff Muskenberg. \'This community engagement stuff is slowing us down and eating into profits.\' The CEO asks you to find a middle ground. How do you advocate for TechFlow\'s future direction?'
    ],
    // No advisor quotes supplied for this card yet.
    advisors: PLACEHOLDER_ADVISORS,
    options: [
      { text: 'Explore, at short-term, models focused on impact more than profit while finding ways to transition away from extractive investor models towards shared ownership and equitable profit sharing with the communities.', score: 5, align: 'full', explanation: 'Environmental justice requires moving beyond extractive capitalist models toward truly equitable economic structures.' },
      { text: 'Explore alternative structures like B-Corp status to focus more on impact than profit.', score: 2, align: 'partial', explanation: 'B-Corp structures help but can still operate within extractive economic systems.' },
      { text: 'Work within the current investor model to make TechFlow as ethical as possible while meeting growth expectations without questioning them.', score: 0, align: 'non', explanation: 'Ethical improvements within extractive systems are very unresponsive to investors interests and don\'t address fundamental issues.' },
      { text: 'Push for stronger internal policies to constrain profit-maximizing behavior.', score: 2, align: 'partial', explanation: 'Policies and regulations can help limit harm but don\'t address the fundamental extractive nature of the system.' },
      { text: 'Implement ESG metrics and impact investing frameworks to balance profit with social good.', score: 0, align: 'non', explanation: 'Market-based solutions often commodify social and environmental values rather than addressing root causes.' }
    ]
  },
  {
    code: 'S.07',
    titleLines: ['BUILDING NOW', 'AT WHAT COST?'],
    principle: 'Environmentally just technology preserves the beauty and utility of the natural world for future generations.',
    paragraphs: [
      'Your alternative economic models gain traction, and TechFlow considers for the first time a transition to a different structure with community stakeholders. But this transition, if it happens, will take time. Meanwhile, TechFlow is facing rapid growth in demand. The technical team reports that current servers are at capacity. \'We need a massive data center,\' explains CTO Marcus Rodriguez. \'I\'m talking about at least 3GW with cutting-edge cooling systems. It\'ll cost us billions but it handle our growth for the next decade or so without the need of third-party servers.\' The engineering team has identified three potential locations but your team is concerned with the impact this mega data center will have on the communities. What\'s your recommendation?'
    ],
    // No advisor quotes supplied for this card yet.
    advisors: PLACEHOLDER_ADVISORS,
    options: [
      { text: 'Approve the data center but ensure it uses 100% renewable energy and the most efficient cooling systems.', score: 2, align: 'partial', explanation: 'Renewable energy is better than fossil fuels, but this doesn\'t question whether such massive infrastructure is necessary at all.' },
      { text: 'Build the facility but offset all environmental impacts through verified carbon credit programs.', score: 0, align: 'non', explanation: 'Offsetting often fails to address local environmental damage and can be a form of greenwashing that avoids real responsibility.' },
      { text: 'Question the assumptions, data, and projections for such a large project and the impact it can have on communities across time while providing alternatives such as distributed, community-owned server networks instead.', score: 5, align: 'full', explanation: 'True environmental preservation requires questioning the need for resource-intensive infrastructure before building it.' },
      { text: 'Approve an underground facility to minimize visual impact and surface environmental disruption while making sure it is built in a place with abundance of water and energy.', score: 0, align: 'non', explanation: 'This addresses aesthetics but not the fundamental environmental and social impacts of massive infrastructure.' },
      { text: 'Build using the highest environmental certification standards and green building practices available.', score: 2, align: 'partial', explanation: 'Green building standards help reduce impact but don\'t question whether the project should exist in the first place.' }
    ]
  },
  {
    code: 'S.08',
    titleLines: ['DESIGN', 'PHILOSOPHY'],
    principle: 'Environmental justice in technology means having a harmonious relationship with the Earth and with all life. Environmentally just tech has a collaborative, regenerative, and sustainable relationship with the natural world, not an extractive relationship.',
    paragraphs: [
      'A current push for distributed infrastructure leads to an innovative \'Community Cloud\' network that becomes TechFlow\'s signature offering. As you design the next generation of this technology, you face a fundamental question about how it should relate to the natural environment.',
      'The engineering team presents different philosophical approaches. Software architect Dr. Sarah Kim asks: \'How might our technology interact with the natural world?\' What philosophy should guide our decision?'
    ],
    // No advisor quotes supplied for this card yet.
    advisors: PLACEHOLDER_ADVISORS,
    options: [
      { text: 'Design technology systems that remain completely separate from natural environments to prevent interference on ecosystems.', score: 0, align: 'non', explanation: 'Separation continues the harmful divide between technology and nature that underlies many environmental problems.' },
      { text: 'Focus on advanced implementation of biomimicry, designing systems that copy and learn from natural processes in the most efficient way possible.', score: 2, align: 'partial', explanation: 'Biomimicry is positive but doesn\'t necessarily create true synergistic relationships with living systems if used only to further exploit nature in a more efficient way.' },
      { text: 'Build all technology exclusively from sustainable, recyclable, and renewable materials.', score: 2, align: 'partial', explanation: 'Sustainable materials are important but don\'t ensure synergistic relationships with living ecosystems and communities.' },
      { text: 'Prioritize designing all systems to have the smallest possible environmental footprint.', score: 2, align: 'partial', explanation: 'Minimizing impact is good but doesn\'t create the positive, collaborative relationships that environmental justice requires.' },
      { text: 'Create technology that works synergistically with natural systems, functioning as part of integrated ecological networks while aware of the traps of the current socio-economic system.', score: 5, align: 'full', explanation: 'Environmental justice sees technology as part of, not separate from, the web of natural relationships and living systems.' }
    ]
  },
  {
    code: 'S.09',
    titleLines: ['COLONIAL', 'CONSERVATION'],
    principle: 'Environmentally just technology is not used to exclude parts of the Earth for use by some individuals and not others. It enables all people to access all parts of the Earth.',
    paragraphs: [
      'Your synergistic design philosophy leads to a novel network technology that integrates communities with local ecosystems, the team calls it \'Living Network\'. However, a controversial situation emerges: some environmental groups want to use TechFlow\'s platform to create \'digital boundaries\' around sensitive wilderness areas, restricting human access to protect ecosystems. Meanwhile, Indigenous rights advocates argue this continues colonial patterns of land exclusion. You\'re caught in the middle of this debate at a heated community meeting. How do you navigate this tension?'
    ],
    // No advisor quotes supplied for this card yet.
    advisors: PLACEHOLDER_ADVISORS,
    options: [
      { text: 'Support the environmental groups\' position that some sensitive areas need protection from human access.', score: 2, align: 'partial', explanation: 'While ecosystem protection is important, this approach might continue patterns of restricting people\'s access to land.' },
      { text: 'Advocate for access to equitable and sustainable tech for all while directly supporting the indigenous and local communities in their roles as stewards of the sensitive areas within their localities.', score: 5, align: 'full', explanation: 'Environmental justice opposes using technology to exclude people from parts of the Earth, seeking instead equitable access.' },
      { text: 'Defer to existing legal frameworks and property rights to determine appropriate access policies.', score: 0, align: 'non', explanation: 'Current legal systems often reflect colonial and private property structures that can exclude people from accessing land.' },
      { text: 'Focus on a neutral stance for TechFlow\'s technology, deciding to continue the project as is and not taking sides.', score: 0, align: 'non', explanation: 'Neutral stance is a myth and it only reinforces the status quo. Thus, if the status quo is already destructive, so it will be the supposedly neutral stance.' },
      { text: 'Design technology that makes remote natural areas more accessible to all people without getting involved in the issue of ecosystem management.', score: 2, align: 'partial', explanation: 'Increased accessibility is positive, but this doesn\'t address fundamental questions about who controls access decisions.' }
    ]
  },
  {
    code: 'S.10',
    titleLines: ['PATENTS AND', 'THE PRESSURE', 'FOR REVENUE'],
    principle: 'Environmentally just technology is open-source. Environmentally just tech makes all information about its creation (including blueprints, instructions/manuals, and information for repair) freely available and accessible to empower everyone to make, repair, modify, and develop their technology.',
    paragraphs: [
      'TechFlow\'s Living Network technology is attracting attention from major corporations. Legal advisor Janet Morrison presents two paths: \'We could patent everything and license it for significant revenue, or...\' She pauses, knowing your principles. \'We could open-source it all.\' The debate within the company and among the community users is fierce. TechFlow\'s worker Maria argues for patents: \'We need revenue to sustain our work and support progress in our career otherwise many will leave.\' Early community representative David Wakyoalla counters: \'Knowledge should be free and if you decide to make money out of it, there has to be equal distribution of it because we helped you build the tech.\' The decision comes down to your recommendation. What do you propose?'
    ],
    // No advisor quotes supplied for this card yet.
    advisors: PLACEHOLDER_ADVISORS,
    options: [
      { text: 'Publish the details of the technology and release all of it as open source - blueprints, code, repair manuals, and development processes freely available to everyone.', score: 5, align: 'full', explanation: 'Open source principles ensure everyone can make, repair, modify, and develop technology for maximum collective benefit.' },
      { text: 'Keep some core components proprietary to ensure the profit can be redirected to the communities to further sustain its community-focused development work.', score: 0, align: 'non', explanation: 'Proprietary restrictions prevent equal access to technology development and repair capabilities, limiting innovation.' },
      { text: 'Patent the technology but allow free use for research, education, and community benefit projects.', score: 2, align: 'partial', explanation: 'Although interesting as a model, this approach still restrict access and don\'t align with environmental justice principles of universal access.' },
      { text: 'Make the technology open source but keep certain critical elements proprietary for safety reasons.', score: 0, align: 'non', explanation: 'Security concerns are often used to justify restrictions that maintain power imbalances rather than truly protecting people.' },
      { text: 'Patent the technology but allow the original communities to keep using it for free.', score: 2, align: 'partial', explanation: 'While that shows the appreciation for early users it limits access to other groups in similar situations.' }
    ]
  },
  {
    code: 'S.11',
    titleLines: ['UNINTENDED', 'CONSEQUENCES'],
    principle: 'Environmental justice in technology requires that the burdens and benefits of technology be equally shared amongst all people. Environmentally just tech will never empower one group at the expense of another.',
    paragraphs: [
      'Your open-source decision transforms TechFlow into a global movement, with communities worldwide adapting your Living Network technology. However, a troubling pattern becomes explicit in the data: urban areas using the technology are thriving with new economic opportunities and improved services. But rural regions hosting the network\'s server are being exploited by investors that learn about the community\'s vulnerabilities while also experiencing increased energy consumption and electronic waste. Environmental justice advocate Dr. Rosa Martinez confronts you at a conference: \'Your technology is making the issues explicit but it is also reproducing the same old patterns of exploitation.\' How do you address this crisis?'
    ],
    // No advisor quotes supplied for this card yet.
    advisors: PLACEHOLDER_ADVISORS,
    options: [
      { text: 'Promise to establish a fund to compensate rural communities for hosting network infrastructure.', score: 2, align: 'partial', explanation: 'Compensation acknowledges the problem but doesn\'t address the fundamental inequity of unequal burden distribution.' },
      { text: 'Immediately halt expansion until you can redesign the system so benefits and burdens are equally shared among all communities while protecting the most vulnerable ones from being further exploited.', score: 5, align: 'full', explanation: 'Environmental justice demands that both the benefits and burdens of technology be equally distributed across all communities.' },
      { text: 'Continue expansion because the urban benefits serve the greater good and will eventually reach rural areas.', score: 0, align: 'non', explanation: '\'Greater good\' arguments often perpetuate environmental injustice by ignoring those who bear the costs of progress.' },
      { text: 'Relocate server infrastructure to less populated areas to minimize the number of people experiencing negative impacts.', score: 0, align: 'non', explanation: 'This approach shifts burdens to fewer people rather than addressing the fundamental inequity of burden distribution.' },
      { text: 'Tap into the situation by creating a marketplace where issues in cities and countryside are framed as opportunities for investment.', score: 2, align: 'partial', explanation: 'Marketplace is poorly distributed context enables and reinforces the exploitative dynamic that contributed and/or created the inequalities, where those with money will benefit the most.' }
    ]
  },
  {
    code: 'S.12',
    titleLines: ['THE SUPPLY', 'CHAIN', 'REVELATION'],
    principle: 'Environmental justice in technology strives to eliminate global and local burdens inherent in its creation.',
    paragraphs: [
      'While redesigning for equitable distribution, your team\'s investigation reveals a disturbing truth about TechFlow\'s supply chain. Despite your ethical intentions, the technology relies on rare earth minerals extracted through environmentally destructive mining in the Democratic Republic of Congo (DRC), causing displacement and health problems for local communities. Supply chain manager Kevin Chen presents the harsh reality: \'Almost all electronics depend on these materials. Even our \'ethical\' competitors use the same suppliers. Moreover, our global operation, however, is doing much better than the competition. I am not sure this single aspect is so concerning.\' How do you respond?'
    ],
    // No advisor quotes supplied for this card yet.
    advisors: PLACEHOLDER_ADVISORS,
    options: [
      { text: 'Switch to suppliers that use renewable energy and improved waste reduction in their mining and manufacturing processes.', score: 2, align: 'partial', explanation: 'These improvements reduce harm but don\'t eliminate the fundamental burden of extractive production on communities.' },
      { text: 'Advocate for moving mining operations to less populated areas outside DRC to minimize direct human impact.', score: 0, align: 'non', explanation: 'This shifts environmental and social burdens rather than eliminating them, continuing extractive patterns.' },
      { text: 'Commit to fundamentally redesigning technology and supply chains to eliminate extractive and harmful processes entirely, including investing in research for better materials altogether.', score: 5, align: 'full', explanation: 'True environmental justice requires systemic and structural changes to how we create technology, not just improvements to existing systems.' },
      { text: 'Increase automation in mining and manufacturing to reduce direct human exposure to these dangerous activities.', score: 0, align: 'non', explanation: 'This may protects some workers but it can also completely substitute humans and might even increase the broader environmental and social costs of extraction by increasing efficiency.' },
      { text: 'Advocate for and comply with the strictest available environmental and labor regulations in all operations.', score: 2, align: 'partial', explanation: 'Stronger regulations can limit harm but don\'t eliminate the fundamental burdens of extractive production systems.' }
    ]
  },
  {
    code: 'S.13',
    titleLines: ['GLOBAL', 'DEPLOYMENT'],
    principle: 'Environmental justice in technology calls for the deployment of technology where and when it is appropriate and beneficial to its local community. When these criteria are not met, environmentally just technology is not deployed.',
    paragraphs: [
      'Your commitment to eliminating extractive processes leads to a revolutionary breakthrough: TechFlow develops the first truly regenerative manufacturing process using bioengineered materials. Now, governments and organizations worldwide want to deploy your system. Requests pour in from Silicon Valley, Lagos, Tokyo, Mumbai, and São Paulo. Each location offers different advantages - profit potential, existing infrastructure, political support. This situation has also led you to a new role with a larger team: congratulations, you are now Global Tech Deployment Director and responding directly to the CEO! But great power comes with great responsibilities and risks. How do you decide where and when to expand?'
    ],
    // No advisor quotes supplied for this card yet.
    advisors: PLACEHOLDER_ADVISORS,
    options: [
      { text: 'Prioritize locations where deployment can generate the highest profits to fund further expansion.', score: 0, align: 'non', explanation: 'Profit-driven deployment often ignores community needs and can exacerbate existing inequalities.' },
      { text: 'Use market research to identify regions with the highest demand and concentrate efforts there first.', score: 0, align: 'non', explanation: 'Market research doesn\'t necessarily reflect what\'s most beneficial for communities or environmental justice.' },
      { text: 'Perform independent research and work with potential local partners to know if, where and when the technology is appropriate and beneficial to local communities before deciding to expand.', score: 5, align: 'full', explanation: 'Environmental justice prioritizes local community benefit and appropriateness over market considerations or profit potential.' },
      { text: 'Focus deployment in locations where the technology can have the greatest positive impact on the largest number of people.', score: 2, align: 'partial', explanation: 'Utilitarian approaches can overlook minority communities and specific local contexts that matter for justice.' },
      { text: 'Prioritize areas where existing infrastructure and resources already exist and can best support the technology deployment which will benefit the local communities.', score: 0, align: 'non', explanation: 'This approach can perpetuate existing inequalities in infrastructure and technological access across communities.' }
    ]
  },
  {
    code: 'S.14',
    titleLines: ['THE LEGACY', 'PROBLEM'],
    principle: 'Environmental justice in technology provides for the cleanup and restoration of lands, waters, and communities that have been harmed by past uses of technology.',
    paragraphs: [
      'Five years after your regenerative breakthrough, TechFlow\'s old technology continues causing problems. An investigative report reveals that communities in three countries are still dealing with environmental harm that can be linked directly and indirectly to TechFlow\'s pre-regenerative systems. Activist journalist Maria Santos confronts you: \'You\'ve moved on to clean technology, but what about the mess you left behind? Didn\'t your company just use people to develop and be seen as Mr. Nice Guy?\' The TechFlow board - which has already a good amount of representatives from communities you work with - is divided on how to respond. What do you advocate?'
    ],
    // No advisor quotes supplied for this card yet.
    advisors: PLACEHOLDER_ADVISORS,
    options: [
      { text: 'Focus company resources on preventing future harm rather than addressing these past problems.', score: 0, align: 'non', explanation: 'Ignoring past harms perpetuates environmental injustice and fails to address the ongoing suffering of affected communities.' },
      { text: 'Take direct responsibility for comprehensive regeneration of nature and communities harmed by past operations while being transparent about how to avoid future harm.', score: 5, align: 'full', explanation: 'Environmental justice requires actively repairing the harm caused by past technological decisions, not just preventing future harm.' },
      { text: 'Provide significant financial support to government-led cleanup efforts in all affected regions.', score: 2, align: 'partial', explanation: 'Financial support is helpful but doesn\'t fulfill the company\'s full responsibility for direct restoration and community healing.' },
      { text: 'Publicly acknowledge past harms and document them transparently in all company communications.', score: 2, align: 'partial', explanation: 'Acknowledging is important for accountability but insufficient without concrete restoration actions and community repair.' },
      { text: 'Implement strict new policies to ensure future technology deployments never cause similar environmental or health impacts anywhere in the world.', score: 2, align: 'partial', explanation: 'Prevention policies are crucial but don\'t address the urgent need to repair existing damage and heal affected communities.' }
    ]
  },
  {
    code: 'S.15',
    titleLines: ['THE GREEN', 'MASK'],
    principle: 'Environmental justice in technology calls for the removal of colonial and neocolonial intentions with technology; instead, it encourages self-determination, freedom, and repatriation.',
    paragraphs: [
      'Your comprehensive restoration efforts win praise globally, but they also attract criticism from unexpected sources that you thought were supporting you. During a restoration project in Mexico, Indigenous leader Carlos Mendoza challenges your approach: \'You\'re still doing this TO us, not WITH us. You only work with us to know our problems but you still have total control on what restoration looks like, you hire the contractors, you define success. This is the same colonial pattern with a green mask.\' His words sting because you recognize their truth but it feels hard to accept given all the effort you have done throughout the years to help them. How do you fundamentally change TechFlow\'s approach?'
    ],
    // No advisor quotes supplied for this card yet.
    advisors: PLACEHOLDER_ADVISORS,
    options: [
      { text: 'Identify and remove colonial patterns from all operations and work on a process to transfer real power to support Indigenous sovereignty and land rights.', score: 5, align: 'full', explanation: 'Environmental justice demands actively dismantling colonial structures and supporting Indigenous sovereignty and community control.' },
      { text: 'Include more Indigenous voices and diverse perspectives in TechFlow\'s restoration and development teams.', score: 2, align: 'partial', explanation: 'Representation helps but doesn\'t address the systemic colonial structures embedded in how technology development operates.' },
      { text: 'Provide comprehensive technology training and education to Indigenous and affected communities.', score: 0, align: 'non', explanation: 'This can perpetuate colonial relationships by imposing external technological paradigms rather than respecting community knowledge.' },
      { text: 'Establish formal partnerships with Indigenous organizations and communities for all technology and restoration projects.', score: 2, align: 'partial', explanation: 'Partnerships can be valuable but don\'t necessarily transfer real power or address underlying colonial structures in decision-making.' },
      { text: 'Study and incorporate traditional ecological knowledge and practices into all technology design and restoration work.', score: 2, align: 'partial', explanation: 'Learning from traditional knowledge can be valuable but may be extractive if not done with proper respect, reciprocity, and community control.' }
    ]
  },
  {
    code: 'S.16',
    titleLines: ['THE LIVING', 'TECHNOLOGY'],
    principle: 'Environmentally just technology is not separate from nature, Earth, and the environment. Rather, it works synergistically with nature.',
    paragraphs: [
      'The process of transferring real power to communities transforms TechFlow so deeply that your CEO steps down and the board - now majoritarily composed by community members - decides that you right person for the job. Congrats, you are now TechFlow\'s CEO! But right in your first month as CEO, a news spread like wild fire in conservative media: \'Tension between communist TechFlow and terrorist Zapatista groups in Mexico amidst tech development spark Indian outrage\'. The board is agitated, even so called progressive partners are taking the bait. You talk to your team and they explain: \'The communities in Chiapas have been with us for a while now but they are threatening to build their own tech if we don\'t find a way to stop treating nature as a thing separate from us.\' How do you approach this situation?'
    ],
    // No advisor quotes supplied for this card yet.
    advisors: PLACEHOLDER_ADVISORS,
    options: [
      { text: 'Implement a policy that blocks communities under control of paramilitary groups from using the technology, keeping the current systems as is while transitioning to work with non-indigenous communities only.', score: 0, align: 'non', explanation: 'Communities should not be judged by regional armed conflicts and separation continues the harmful divide between technology and nature that underlies many environmental and social problems.' },
      { text: 'Avoid the news and focus on advanced biomimicry, creating technology that copies and learns from natural processes and organisms.', score: 2, align: 'partial', explanation: 'Avoiding conservative traps might be useful but focusing on biomimicry only may not necessarily create the true synergistic relationships with living systems that communities need.' },
      { text: 'Publicly defend the rights of indigenous communities all around the world while creating a team to focus on a transdisciplinary R&D process to pilot technologies that works according to the community\'s relationship with life.', score: 5, align: 'full', explanation: 'Environmental justice sees technology as part of, not separate from, the web of natural relationships and community life.' },
      { text: 'Give a statement that does not address your commitment with indigenous peoples but aggressively attacks violent groups and promise to prioritize design all systems to have the smallest possible environmental impact.', score: 2, align: 'partial', explanation: 'Playing with ambiguity is risky and might support the status quo. Minimizing impact is good but doesn\'t create the positive, collaborative relationships with nature that the communities envision.' },
      { text: 'Build all requested technology exclusively from local, sustainable, recyclable, and renewable materials.', score: 2, align: 'partial', explanation: 'Sustainable materials are important but don\'t ensure the synergistic relationships with living ecosystems and community life.' }
    ]
  },
  {
    code: 'S.17',
    titleLines: ['INCONVENIENT', 'TRUTHS'],
    principle: 'Environmentally Just Tech is intentional about harm. It is cognizant of who a given technology helps and who it harms.',
    paragraphs: [
      'Working with the communities in Chiapas creates technology that truly lives within natural systems, but it also reveals uncomfortable truths about TechFlow\'s global impact. Your community-controlled cooperatives are thriving in some places while still struggling in others. In Kenya, the technology empowers small farmers, but in Bangladesh, it\'s being captured by wealthy landowners who exclude poorer farmers. You thought this was over years ago but the problem keeps coming back and the complexity overwhelms you during a sleepless night in your Mexico City hotel. How do you address the reality that your technology may always help some while harming others?'
    ],
    // No advisor quotes supplied for this card yet.
    advisors: PLACEHOLDER_ADVISORS,
    options: [
      { text: 'Conduct comprehensive impact assessments before each new cooperative begins operating, making sure that all projects are following strict guidelines and adapting them to each local context.', score: 2, align: 'partial', explanation: 'Impact assessments are important but don\'t ensure ongoing, active attention to who benefits and who is harmed over time.' },
      { text: 'Provide regular training for all cooperative members on identifying and addressing potential negative impacts.', score: 2, align: 'partial', explanation: 'Training raises awareness but doesn\'t ensure systematic attention to harm nor actual support throughout all development and deployment processes.' },
      { text: 'Establish ethics committees and review boards with global experts to evaluate how the technology impacts the communities.', score: 0, align: 'non', explanation: 'Expert committees can help but don\'t ensure day-to-day intentionality about harm in actual operations and community relationships (they may even reproduce colonial patterns).' },
      { text: 'Develop comprehensive ethical guidelines and standards to be followed consistently through systems of incentive and punishment.', score: 0, align: 'non', explanation: 'Standards provide minimum guidance but don\'t ensure active, ongoing attention to who is helped and harmed in each context.' },
      { text: 'Commit to break the myth of tech neutrality, being cognizant of how tech will always be influenced by the larger socio-economic system in place requiring continuous assessment of who it helps and harms and how to improve.', score: 5, align: 'full', explanation: 'Intentionality about harm requires continuous vigilance and action, not just initial assessment or periodic reviews.' }
    ]
  },
  {
    code: 'S.18',
    titleLines: ['DEMOCRATIC', 'CRISIS'],
    principle: 'Environmental justice in technology demands that democracy be the foundation of all of its endeavors. A democratic and community-centric environment is necessary to have a just world.',
    paragraphs: [
      'Your commitment to addressing systemic harm leads to a major reorganization of the global cooperative network. However, this creates a new challenge: the network has grown so large that decision-making is becoming unwieldy. Some cooperatives want centralized efficiency, others demand local autonomy. The tension comes to a head during a heated video conference with the cooperative representatives. Fatima from Detroit argues: \'We need faster decisions to compete with big tech.\' But James from Ghana counters: \'Speed kills democracy.\' As the leading figure and network\'s founding architect, everyone looks to you for guidance. What structure do you propose?'
    ],
    // No advisor quotes supplied for this card yet.
    advisors: PLACEHOLDER_ADVISORS,
    options: [
      { text: 'Organize regular global assemblies where all representatives can discuss and debate network-wide decisions.', score: 0, align: 'non', explanation: 'Global assemblies are valuable but don\'t necessarily give each community real decision-making power over technology affecting them.' },
      { text: 'Ensure that each affected community maintains actual local power to make binding decisions about technology that impacts their lives independent of suggestions from global advisory councils.', score: 5, align: 'full', explanation: 'True democratic technology requires communities to have actual authority over their technological futures, not just input opportunities.' },
      { text: 'Create advisory councils with representatives from each cooperative to guide network-wide policy decisions.', score: 0, align: 'non', explanation: 'While debate is important, advisory structures often lack real power and can even be used to legitimize decisions made elsewhere in the network.' },
      { text: 'Start public-private partnership models that include cooperative representatives as advisors in local governance structures.', score: 0, align: 'non', explanation: 'Advisory roles lack real decision power and public-private partnerships often prioritize efficiency and external interests over genuine community needs and self-determination.' },
      { text: 'Invite community representatives to join a central coordinating board with decision-making authority for large global network issues.', score: 2, align: 'partial', explanation: 'Central board representation can provide some influence but doesn\'t ensure community control over local technology decisions.' }
    ]
  },
  {
    code: 'S.19',
    titleLines: ['DATA', 'SOVEREIGNTY'],
    principle: 'Environmental justice in technology calls for the removal of colonial and neocolonial intentions with technology; instead, it encourages self-determination, freedom, and repatriation.',
    paragraphs: [
      'The democratic restructuring works, but it surfaces a critical issue that\'s been simmering all this time: data sovereignty. The cooperative network has accumulated vast amounts of community data - agricultural patterns, health trends, economic flows, social relationships - they can access it but it is all in TechFlow\'s dataservers. Now governments, researchers, and corporations are demanding access. The European Union offers a trade deal contingent on data sharing. The UN wants health data for pandemic preparedness. Tech giants offer millions for purchasing patterns. Community leader Amara from Brazil cuts through the noise: \'This is our information, about our lives, our land, our children. We should decide what happens to it!\' What\'s your position?'
    ],
    // No advisor quotes supplied for this card yet.
    advisors: PLACEHOLDER_ADVISORS,
    options: [
      { text: 'Allow cooperatives to control data with strong privacy policies and security measures protecting community information.', score: 5, align: 'full', explanation: 'Cooperative control is better than corporate control, but it only ensures community sovereignty over their own information if the community finds itself represented by the cooperative.' },
      { text: 'Provide the data only to democratic governments to ensure data is used for legitimate public benefit and scientific research.', score: 0, align: 'non', explanation: 'While regulations and laws for data protection are important, government oversight doesn\'t ensure community self-determination over their data.' },
      { text: 'Ensure that communities and individuals maintain complete control over their own data, being directly involved in discussions and holding the final decision about data access and use.', score: 5, align: 'full', explanation: 'Data sovereignty means communities control their own information, supporting self-determination and preventing exploitation by outside entities.' },
      { text: 'Establish independent third-party organizations to serve as neutral custodians of all community data.', score: 0, align: 'non', explanation: 'Third-party custodians may be preferable to corporate and government control, but unless directly and majoritarily represented by community members they still don\'t give communities direct sovereignty over their information.' },
      { text: 'Create multi-stakeholder governance bodies that include community representatives to oversee global data use decisions.', score: 2, align: 'partial', explanation: 'Multi-stakeholder approaches can include community voices but may dilute community control over their own information and lives.' }
    ]
  }
];

// Gauge is cumulative across every scenario: 0..+5 per question --
// non-aligned 0, partially aligned 2, fully aligned 5.
export const SCORE_MIN = SCENARIOS.length * 0;
export const SCORE_MAX = SCENARIOS.length * 5;
