import quadrantMap from '../quadrants.json';

// Alignment sourced from the EJIT debrief sheets for each scenario. What each
// alignment is worth comes from quadrants.json, the same file the Modal
// aggregation reads -- so an option's score, the radar's range and the
// cross-player average can never be computed on three different scales.
export const ALIGN_POINTS = quadrantMap.points;
export const LETTERS = ['A', 'B', 'C', 'D', 'E'];

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

const SCENARIO_DECK = [
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
      { text: 'Suggest focusing on removing bias from the existing datasets and algorithms.', align: 'partial', explanation: 'A good start, but this approach treats symptoms rather than addressing the root systems that created these biases.' },
      { text: 'Recommend centering anti-racist principles from the ground up and involving affected communities in the redesign.', align: 'full', explanation: 'This approach recognizes that truly just technology must actively dismantle racist systems, not just minimize their effects.' },
      { text: 'Propose making the AI completely colorblind by removing all demographic indicators.', align: 'non', explanation: 'Colorblind approaches often perpetuate existing inequalities by ignoring the reality of already existing systemic discrimination. It artificially removes aspects that are relevant to the issue' },
      { text: 'Recommend implementing quota systems to ensure equal hiring outcomes.', align: 'partial', explanation: 'Quotas are relevant to address the symptoms but, by themselves, do not fix the biased processes and systemic issues that create unequal results in the first place.' },
      { text: 'Suggest training the AI on data from the most successful companies in the industry.', align: 'non', explanation: 'In systems of exploitation, historical success often reflects past discrimination, making this approach potentially harmful to marginalized communities.' }
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
      { text: 'Embrace the fast-paced culture and focus on rapid iteration to stay competitive.', align: 'non', explanation: 'Prioritizing speed often means overlooking critical ethical considerations and community impacts that take time to understand.' },
      { text: 'Recommend following established industry best practices and ensuring regulatory compliance.', align: 'non', explanation: 'Compliance represents minimum standards that often don\'t address environmental justice concerns or community needs.' },
      { text: 'Propose forming diverse review committees to evaluate products before launch.', align: 'partial', explanation: 'Diversity in review helps, but it\'s insufficient without fundamental changes to how innovation processes work from the start.' },
      { text: 'Suggest conducting thorough market research and user testing before any release.', align: 'partial', explanation: 'Traditional research is useful but doesn\'t address deeper questions about who gets to innovate or broader systemic impacts.' },
      { text: 'Advocate for providing resources for all to innovate, considering potential unintended consequences, and centering empathy in every decision.', align: 'full', explanation: 'True responsible innovation requires considering broad access, unintended consequences, and human-centered design at every step.' }
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
      { text: 'Present more detailed information about the platform\'s benefits to help them make a fully informed decision.', align: 'non', explanation: 'This assumes they lack information rather than respecting their autonomy to maintain their traditional way of life' },
      { text: 'Suggest free comprehensive digital literacy training with TechFlow platform only as an option, so they can make a truly fully informed choice.', align: 'partial', explanation: 'While education can be valuable, this still assumes technology adoption is inherently beneficial and desirable.' },
      { text: 'Offer to provide only basic, essential digital services while avoiding advanced features.', align: 'non', explanation: 'This still imposes technology on a community that has clearly expressed they don\'t want it.' },
      { text: 'Respect their choice completely and advocate within TechFlow to protect their right to live without digital interference.', align: 'full', explanation: 'Environmental justice demands preserving Indigenous and traditional ways of living without technological interference.' },
      { text: 'Explain that digital integration is inevitable in the modern world and offer gradual transition support.', align: 'non', explanation: 'This paternalistic approach assumes communities need to \'adapt\' rather than respecting their autonomous choices.' }
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
      { text: 'Accept the contract since the civilian safety applications outweigh the military concerns.', align: 'non', explanation: 'Environmental justice technology explicitly refuses to cooperate with systems of oppression, regardless of potential benefits.' },
      { text: 'Negotiate to accept only if military applications are strictly limited to defensive purposes.', align: 'non', explanation: 'The distinction between \'defensive\' and \'offensive\' use is often unclear and still supports systems of potential violence.' },
      { text: 'Decline the entire project due to concerns with weaponization of intelligent systems and civilian monitoring as enablement of systems of oppression.', align: 'full', explanation: 'True environmental justice demands that technology elevate all people, not enable surveillance, violence, or oppression.' },
      { text: 'Accept the contract if it demonstrably helps prevent greater harm and violence.', align: 'non', explanation: 'This utilitarian logic can be used to justify any harmful application and contradicts environmental justice values.' },
      { text: 'Propose separating civilian and military applications, only developing the civilian safety components.', align: 'partial', explanation: 'While better than full military cooperation, this still doesn\'t address broader concerns about surveillance systems.' }
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
      { text: 'Organize comprehensive community surveys, workshops and feedback sessions to gather input.', align: 'partial', explanation: 'While community feedback is valuable, this doesn\'t give residents actual power in the decision-making process.' },
      { text: 'Establish regular public meetings where community members can voice concerns and ask questions.', align: 'non', explanation: 'Public comment opportunities without real decision power don\'t constitute meaningful democratic participation.' },
      { text: 'Create transparent development processes with regular public updates and information sessions.', align: 'non', explanation: 'Transparency is important but by itself doesn\'t give communities actual decision-making authority over their futures.' },
      { text: 'Design a system where affected communities are informed and have real decision-making power over technologies that impact their neighborhoods.', align: 'full', explanation: 'True democratic technology development requires communities to have actual authority, not just opportunities for consultation.' },
      { text: 'Form community advisory boards with neighborhood representatives to guide implementation of all technologies and systems.', align: 'partial', explanation: 'Advisory roles provide some influence but don\'t ensure community control over decisions that directly affect them.' }
    ]
  },
  {
    code: 'S.06',
    titleLines: ['MOVE FAST AND', 'BREAK THINGS'],
    principle: 'Environmentally just technology dismantles capitalist-centric development and does not harm economic vitality. It promotes equitable and just income (re)distribution across the world.',
    paragraphs: [
      'Portland\'s community-centered approach becomes a model that attracts national attention. However, this success brings new challenges. TechFlow\'s investors are pressuring for rapid expansion and higher profit margins. \'We need to scale fast and maximize returns,\' insists lead investor Jeff Muskenberg. \'This community engagement stuff is slowing us down and eating into profits.\' The CEO asks you to find a middle ground. How do you advocate for TechFlow\'s future direction?'
    ],
    advisors: [
      {
        role: 'Public Policy Expert',
        quote: 'It is time to promote alternatives for the now outdated behaviors that forged our industrial development. The system is not structurally broken as many like to state; it just needs some new painting and, maybe, furniture.'
      },
      {
        role: 'Community Leader',
        quote: 'People like to say that we are naive, idealistic, romantics...that’s their politically correct way to avoid calling us stupid. But we understand the harsh reality of this system much more than anyone because we experience them every day. So, yes, in this world you need money still but the question is: how can we build a world where the tools are not for infinite accumulation but for contentment and distribution?'
      },
      {
        role: 'Tech Entrepreneur',
        quote: 'Corporate health dictates societal health. Taxes, jobs, innovation...all of that and more comes from allowing companies to do their thing. But the few people that can drive real innovation will only do so under real incentive. Sure, some will go too far sometimes but that’s the price to pay in a world where doers are a rarity and braggers and critics are cheap commodities.'
      }
    ],
    options: [
      { text: 'Explore, at short-term, models focused on impact more than profit while finding ways to transition away from extractive investor models towards shared ownership and equitable profit sharing with the communities.', align: 'full', explanation: 'Environmental justice requires moving beyond extractive capitalist models toward truly equitable economic structures.' },
      { text: 'Explore alternative structures like B-Corp status to focus more on impact than profit.', align: 'partial', explanation: 'B-Corp structures help but can still operate within extractive economic systems.' },
      { text: 'Work within the current investor model to make TechFlow as ethical as possible while meeting growth expectations without questioning them.', align: 'non', explanation: 'Ethical improvements within extractive systems are very unresponsive to investors interests and don\'t address fundamental issues.' },
      { text: 'Push for stronger internal policies to constrain profit-maximizing behavior.', align: 'partial', explanation: 'Policies and regulations can help limit harm but don\'t address the fundamental extractive nature of the system.' },
      { text: 'Implement ESG metrics and impact investing frameworks to balance profit with social good.', align: 'non', explanation: 'Market-based solutions often commodify social and environmental values rather than addressing root causes.' }
    ]
  },
  {
    code: 'S.07',
    titleLines: ['BUILDING NOW', 'AT WHAT COST?'],
    principle: 'Environmentally just technology preserves the beauty and utility of the natural world for future generations.',
    paragraphs: [
      'Your alternative economic models gain traction, and TechFlow considers for the first time a transition to a different structure with community stakeholders. But this transition, if it happens, will take time. Meanwhile, TechFlow is facing rapid growth in demand. The technical team reports that current servers are at capacity. \'We need a massive data center,\' explains CTO Marcus Rodriguez. \'I\'m talking about at least 3GW with cutting-edge cooling systems. It\'ll cost us billions but it handle our growth for the next decade or so without the need of third-party servers.\' The engineering team has identified three potential locations but your team is concerned with the impact this mega data center will have on the communities. What\'s your recommendation?'
    ],
    advisors: [
      {
        role: 'Public Policy Expert',
        quote: 'We should not stop progress but we can definitely do it in a better, safer and more ethical way without the need to reinvent the wheel.'
      },
      {
        role: 'Community Leader',
        quote: 'We heard innumerous times that something was inevitable. But inevitability is just a fancy term used to state that we have no actual power in influencing or determining our future. But that is not inevitable, that is just domination. And domination can be overcome.'
      },
      {
        role: 'Tech Entrepreneur',
        quote: 'Progress is inevitable. But progress is also impacted by the law of supply and demand. Thus, make sure you find the places where demand for progress is strong because these will be the places of lowest resistance.'
      }
    ],
    options: [
      { text: 'Approve the data center but ensure it uses 100% renewable energy and the most efficient cooling systems.', align: 'partial', explanation: 'Renewable energy is better than fossil fuels, but this doesn\'t question whether such massive infrastructure is necessary at all.' },
      { text: 'Build the facility but offset all environmental impacts through verified carbon credit programs.', align: 'non', explanation: 'Offsetting often fails to address local environmental damage and can be a form of greenwashing that avoids real responsibility.' },
      { text: 'Question the assumptions, data, and projections for such a large project and the impact it can have on communities across time while providing alternatives such as distributed, community-owned server networks instead.', align: 'full', explanation: 'True environmental preservation requires questioning the need for resource-intensive infrastructure before building it.' },
      { text: 'Approve an underground facility to minimize visual impact and surface environmental disruption while making sure it is built in a place with abundance of water and energy.', align: 'non', explanation: 'This addresses aesthetics but not the fundamental environmental and social impacts of massive infrastructure.' },
      { text: 'Build using the highest environmental certification standards and green building practices available.', align: 'partial', explanation: 'Green building standards help reduce impact but don\'t question whether the project should exist in the first place.' }
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
    advisors: [
      {
        role: 'Public Policy Expert',
        quote: 'Science has all the answers we need to increase our efficiency and reduce our impact without stopping economic progress. Some of these answers, in fact, come directly from the natural world.'
      },
      {
        role: 'Community Leader',
        quote: 'Our obsession with more high tech gadgets and tools is a symptom of our excluding society. We forgot that non-humans play a very important role. “Playing God” is, therefore, not necessarily the attempt to create life in a laboratory. To “play God” is to believe and act as if one form of life could build all the sufficient conditions to survive and thrive without responsible relationship to the rest of life.'
      },
      {
        role: 'Tech Entrepreneur',
        quote: 'Good things are simple by nature. Humans are good at building human things. To believe that we know what is best for other species is of an absurd level of arrogance. We are different and that is a great thing.'
      }
    ],
    options: [
      { text: 'Design technology systems that remain completely separate from natural environments to prevent interference on ecosystems.', align: 'non', explanation: 'Separation continues the harmful divide between technology and nature that underlies many environmental problems.' },
      { text: 'Focus on advanced implementation of biomimicry, designing systems that copy and learn from natural processes in the most efficient way possible.', align: 'partial', explanation: 'Biomimicry is positive but doesn\'t necessarily create true synergistic relationships with living systems if used only to further exploit nature in a more efficient way.' },
      { text: 'Build all technology exclusively from sustainable, recyclable, and renewable materials.', align: 'partial', explanation: 'Sustainable materials are important but don\'t ensure synergistic relationships with living ecosystems and communities.' },
      { text: 'Prioritize designing all systems to have the smallest possible environmental footprint.', align: 'partial', explanation: 'Minimizing impact is good but doesn\'t create the positive, collaborative relationships that environmental justice requires.' },
      { text: 'Create technology that works synergistically with natural systems, functioning as part of integrated ecological networks while aware of the traps of the current socio-economic system.', align: 'full', explanation: 'Environmental justice sees technology as part of, not separate from, the web of natural relationships and living systems.' }
    ]
  },
  {
    code: 'S.09',
    titleLines: ['COLONIAL', 'CONSERVATION'],
    principle: 'Environmentally just technology is not used to exclude parts of the Earth for use by some individuals and not others. It enables all people to access all parts of the Earth.',
    paragraphs: [
      'Your synergistic design philosophy leads to a novel network technology that integrates communities with local ecosystems, the team calls it \'Living Network\'. However, a controversial situation emerges: some environmental groups want to use TechFlow\'s platform to create \'digital boundaries\' around sensitive wilderness areas, restricting human access to protect ecosystems. Meanwhile, Indigenous rights advocates argue this continues colonial patterns of land exclusion. You\'re caught in the middle of this debate at a heated community meeting. How do you navigate this tension?'
    ],
    advisors: [
      {
        role: 'Public Policy Expert',
        quote: 'To fight for democracy is to understand that rarely, if ever, people will find consensus. Sometimes, we can create ways that do not need to touch these conflicts. Other times, we do need to take difficult decisions to protect the valuable resources that determine the prosperity and sovereignty of our nation.'
      },
      {
        role: 'Community Leader',
        quote: 'The view that humans are not part of nature is the basis for many harmful projects and policies led by ecologist and conservationist organizations. To say that human activity is causing environmental problems is to equally distribute the responsibility for the harms across all cultures, which by the way is the only thing that the elite is good at distributing. But not every culture in this world is the same. Not everyone sees the world in the same way.'
      },
      {
        role: 'Tech Entrepreneur',
        quote: 'This world is filled with critics and there is nothing you will do that will not be condemned, including your attempts to do good. Just make sure you play within the fuzzy boundaries of the system and if you decide to leave your comfort zone, make sure the reward truly pays off the risk.'
      }
    ],
    options: [
      { text: 'Support the environmental groups\' position that some sensitive areas need protection from human access.', align: 'partial', explanation: 'While ecosystem protection is important, this approach might continue patterns of restricting people\'s access to land.' },
      { text: 'Advocate for access to equitable and sustainable tech for all while directly supporting the indigenous and local communities in their roles as stewards of the sensitive areas within their localities.', align: 'full', explanation: 'Environmental justice opposes using technology to exclude people from parts of the Earth, seeking instead equitable access.' },
      { text: 'Defer to existing legal frameworks and property rights to determine appropriate access policies.', align: 'non', explanation: 'Current legal systems often reflect colonial and private property structures that can exclude people from accessing land.' },
      { text: 'Focus on a neutral stance for TechFlow\'s technology, deciding to continue the project as is and not taking sides.', align: 'non', explanation: 'Neutral stance is a myth and it only reinforces the status quo. Thus, if the status quo is already destructive, so it will be the supposedly neutral stance.' },
      { text: 'Design technology that makes remote natural areas more accessible to all people without getting involved in the issue of ecosystem management.', align: 'partial', explanation: 'Increased accessibility is positive, but this doesn\'t address fundamental questions about who controls access decisions.' }
    ]
  },
  {
    code: 'S.10',
    titleLines: ['PATENTS AND', 'THE PRESSURE', 'FOR REVENUE'],
    principle: 'Environmentally just technology is open-source. Environmentally just tech makes all information about its creation (including blueprints, instructions/manuals, and information for repair) freely available and accessible to empower everyone to make, repair, modify, and develop their technology.',
    paragraphs: [
      'TechFlow\'s Living Network technology is attracting attention from major corporations. Legal advisor Janet Morrison presents two paths: \'We could patent everything and license it for significant revenue, or...\' She pauses, knowing your principles. \'We could open-source it all.\' The debate within the company and among the community users is fierce. TechFlow\'s worker Maria argues for patents: \'We need revenue to sustain our work and support progress in our career otherwise many will leave.\' Early community representative David Wakyoalla counters: \'Knowledge should be free and if you decide to make money out of it, there has to be equal distribution of it because we helped you build the tech.\' The decision comes down to your recommendation. What do you propose?'
    ],
    advisors: [
      {
        role: 'Public Policy Expert',
        quote: 'There is no such a thing as free lunch for all, unfortunately. Some people will have to pay for others to have access to certain benefits. This is the beauty of living in a free society that understands the value of our entrepreneurs because it is through their leadership that we can use capital for the good.'
      },
      {
        role: 'Community Leader',
        quote: 'Everything we do has both a destructive and constructive impact. So here is a simple rule for a better society: if you truly believe that what you created helps more than harms the creation of a more just and fair society, then make it available and accessible to all.  But remember, you can only share what is yours.'
      },
      {
        role: 'Tech Entrepreneur',
        quote: 'Fully open source technology only happens when the tech is horrible or useless or when it is a little marketing stunt to get people to buy your main product. Keep what is valuable under your control so you can decide how it is used and by whom.'
      }
    ],
    options: [
      { text: 'Publish the details of the technology and release all of it as open source - blueprints, code, repair manuals, and development processes freely available to everyone.', align: 'full', explanation: 'Open source principles ensure everyone can make, repair, modify, and develop technology for maximum collective benefit.' },
      { text: 'Keep some core components proprietary to ensure the profit can be redirected to the communities to further sustain its community-focused development work.', align: 'non', explanation: 'Proprietary restrictions prevent equal access to technology development and repair capabilities, limiting innovation.' },
      { text: 'Patent the technology but allow free use for research, education, and community benefit projects.', align: 'partial', explanation: 'Although interesting as a model, this approach still restrict access and don\'t align with environmental justice principles of universal access.' },
      { text: 'Make the technology open source but keep certain critical elements proprietary for safety reasons.', align: 'non', explanation: 'Security concerns are often used to justify restrictions that maintain power imbalances rather than truly protecting people.' },
      { text: 'Patent the technology but allow the original communities to keep using it for free.', align: 'partial', explanation: 'While that shows the appreciation for early users it limits access to other groups in similar situations.' }
    ]
  },
  {
    code: 'S.11',
    titleLines: ['UNINTENDED', 'CONSEQUENCES'],
    principle: 'Environmental justice in technology requires that the burdens and benefits of technology be equally shared amongst all people. Environmentally just tech will never empower one group at the expense of another.',
    paragraphs: [
      'Your open-source decision transforms TechFlow into a global movement, with communities worldwide adapting your Living Network technology. However, a troubling pattern becomes explicit in the data: urban areas using the technology are thriving with new economic opportunities and improved services. But rural regions hosting the network\'s server are being exploited by investors that learn about the community\'s vulnerabilities while also experiencing increased energy consumption and electronic waste. Environmental justice advocate Dr. Rosa Martinez confronts you at a conference: \'Your technology is making the issues explicit but it is also reproducing the same old patterns of exploitation.\' How do you address this crisis?'
    ],
    advisors: [
      {
        role: 'Public Policy Expert',
        quote: 'Not every consequence can be foreseen even by the smartest scientists alive. Thus, we need to find ways to address and minimize the harms that will happen. Additionally, we need to start seeing our challenges as opportunities for growth.'
      },
      {
        role: 'Community Leader',
        quote: 'We all know that until nowadays some people still believe to be superior to others and, therefore, they believe the spaces they inhabit should also reflect this superiority. All of this is often done by exploiting both the spaces and lives considered “inferior”. But, at this point, there is no place in this world that hasn’t been exploited. So, either these wannabe Gods leave permanently this planet in their space ships or they stay here and learn how to share.'
      },
      {
        role: 'Tech Entrepreneur',
        quote: 'Look, when people talk about trickle down effect what they are saying is that some places and people are just more efficient at driving progress than others. Sure, you don’t need to concentrate all the energy in those places and people, you can shift some of it to others. But, in general, this is how we can get things done.'
      }
    ],
    options: [
      { text: 'Promise to establish a fund to compensate rural communities for hosting network infrastructure.', align: 'partial', explanation: 'Compensation acknowledges the problem but doesn\'t address the fundamental inequity of unequal burden distribution.' },
      { text: 'Immediately halt expansion until you can redesign the system so benefits and burdens are equally shared among all communities while protecting the most vulnerable ones from being further exploited.', align: 'full', explanation: 'Environmental justice demands that both the benefits and burdens of technology be equally distributed across all communities.' },
      { text: 'Continue expansion because the urban benefits serve the greater good and will eventually reach rural areas.', align: 'non', explanation: '\'Greater good\' arguments often perpetuate environmental injustice by ignoring those who bear the costs of progress.' },
      { text: 'Relocate server infrastructure to less populated areas to minimize the number of people experiencing negative impacts.', align: 'non', explanation: 'This approach shifts burdens to fewer people rather than addressing the fundamental inequity of burden distribution.' },
      { text: 'Tap into the situation by creating a marketplace where issues in cities and countryside are framed as opportunities for investment.', align: 'partial', explanation: 'Marketplace is poorly distributed context enables and reinforces the exploitative dynamic that contributed and/or created the inequalities, where those with money will benefit the most.' }
    ]
  },
  {
    code: 'S.12',
    titleLines: ['THE SUPPLY', 'CHAIN', 'REVELATION'],
    principle: 'Environmental justice in technology strives to eliminate global and local burdens inherent in its creation.',
    paragraphs: [
      'While redesigning for equitable distribution, your team\'s investigation reveals a disturbing truth about TechFlow\'s supply chain. Despite your ethical intentions, the technology relies on rare earth minerals extracted through environmentally destructive mining in the Democratic Republic of Congo (DRC), causing displacement and health problems for local communities. Supply chain manager Kevin Chen presents the harsh reality: \'Almost all electronics depend on these materials. Even our \'ethical\' competitors use the same suppliers. Moreover, our global operation, however, is doing much better than the competition. I am not sure this single aspect is so concerning.\' How do you respond?'
    ],
    advisors: [
      {
        role: 'Public Policy Expert',
        quote: 'Profit was never the problem. The real problem is dirty profit. It is time for us to invest in what I call “clean profit” which can only be achieved by adapting industrial activity to better environmental regulations and sustainable technologies.'
      },
      {
        role: 'Community Leader',
        quote: 'Every improvement to this system that does not intend to create structural change is nothing but a smaller step towards planetary breakdown. Slowing down through tech or policies will only give us additional time, but it does not solve the fundamental issues that brought us to this crisis.'
      },
      {
        role: 'Tech Entrepreneur',
        quote: 'Progress often demands sacrifices but progress also creates ways to reduce these sacrifices without blocking further progress.'
      }
    ],
    options: [
      { text: 'Switch to suppliers that use renewable energy and improved waste reduction in their mining and manufacturing processes.', align: 'partial', explanation: 'These improvements reduce harm but don\'t eliminate the fundamental burden of extractive production on communities.' },
      { text: 'Advocate for moving mining operations to less populated areas outside DRC to minimize direct human impact.', align: 'non', explanation: 'This shifts environmental and social burdens rather than eliminating them, continuing extractive patterns.' },
      { text: 'Commit to fundamentally redesigning technology and supply chains to eliminate extractive and harmful processes entirely, including investing in research for better materials altogether.', align: 'full', explanation: 'True environmental justice requires systemic and structural changes to how we create technology, not just improvements to existing systems.' },
      { text: 'Increase automation in mining and manufacturing to reduce direct human exposure to these dangerous activities.', align: 'non', explanation: 'This may protects some workers but it can also completely substitute humans and might even increase the broader environmental and social costs of extraction by increasing efficiency.' },
      { text: 'Advocate for and comply with the strictest available environmental and labor regulations in all operations.', align: 'partial', explanation: 'Stronger regulations can limit harm but don\'t eliminate the fundamental burdens of extractive production systems.' }
    ]
  },
  {
    code: 'S.13',
    titleLines: ['GLOBAL', 'DEPLOYMENT'],
    principle: 'Environmental justice in technology calls for the deployment of technology where and when it is appropriate and beneficial to its local community. When these criteria are not met, environmentally just technology is not deployed.',
    paragraphs: [
      'Your commitment to eliminating extractive processes leads to a revolutionary breakthrough: TechFlow develops the first truly regenerative manufacturing process using bioengineered materials. Now, governments and organizations worldwide want to deploy your system. Requests pour in from Silicon Valley, Lagos, Tokyo, Mumbai, and São Paulo. Each location offers different advantages - profit potential, existing infrastructure, political support. This situation has also led you to a new role with a larger team: congratulations, you are now Global Tech Deployment Director and responding directly to the CEO! But great power comes with great responsibilities and risks. How do you decide where and when to expand?'
    ],
    advisors: [
      {
        role: 'Public Policy Expert',
        quote: 'It is true that some places and groups are more vulnerable, but there are moments where the best thing to do is to help those that can further facilitate change even if they are not in positions of vulnerability. Just like in airplanes, when the adult has to put the oxygen mask first before helping a child or older adult.'
      },
      {
        role: 'Community Leader',
        quote: 'When you go to someone’s house, the respectable thing to do is to first know if you are welcomed there. If yes, then you get to discuss with residents of the house about specific details such as time, date, and what they want you to bring. This simple rule applies well pretty much everywhere.'
      },
      {
        role: 'Tech Entrepreneur',
        quote: 'The idea is simple: go where the energy is. That is, find not only the places where the demand for your product is high but also where the capital investments are low. The higher your return on investment, the better able you will be to do extra things of your choice such as helping others in need.'
      }
    ],
    options: [
      { text: 'Prioritize locations where deployment can generate the highest profits to fund further expansion.', align: 'non', explanation: 'Profit-driven deployment often ignores community needs and can exacerbate existing inequalities.' },
      { text: 'Use market research to identify regions with the highest demand and concentrate efforts there first.', align: 'non', explanation: 'Market research doesn\'t necessarily reflect what\'s most beneficial for communities or environmental justice.' },
      { text: 'Perform independent research and work with potential local partners to know if, where and when the technology is appropriate and beneficial to local communities before deciding to expand.', align: 'full', explanation: 'Environmental justice prioritizes local community benefit and appropriateness over market considerations or profit potential.' },
      { text: 'Focus deployment in locations where the technology can have the greatest positive impact on the largest number of people.', align: 'partial', explanation: 'Utilitarian approaches can overlook minority communities and specific local contexts that matter for justice.' },
      { text: 'Prioritize areas where existing infrastructure and resources already exist and can best support the technology deployment which will benefit the local communities.', align: 'non', explanation: 'This approach can perpetuate existing inequalities in infrastructure and technological access across communities.' }
    ]
  },
  {
    code: 'S.14',
    titleLines: ['THE LEGACY', 'PROBLEM'],
    principle: 'Environmental justice in technology provides for the cleanup and restoration of lands, waters, and communities that have been harmed by past uses of technology.',
    paragraphs: [
      'Five years after your regenerative breakthrough, TechFlow\'s old technology continues causing problems. An investigative report reveals that communities in three countries are still dealing with environmental harm that can be linked directly and indirectly to TechFlow\'s pre-regenerative systems. Activist journalist Maria Santos confronts you: \'You\'ve moved on to clean technology, but what about the mess you left behind? Didn\'t your company just use people to develop and be seen as Mr. Nice Guy?\' The TechFlow board - which has already a good amount of representatives from communities you work with - is divided on how to respond. What do you advocate?'
    ],
    advisors: [
      {
        role: 'Public Policy Expert',
        quote: 'There is a hard truth that few like to hear, but one can only do so much to remediate past harms. Find out how much you can do and offer what you can. To go beyond your possibilities is to open yourself to have your vulnerabilities exploited by bad actors.'
      },
      {
        role: 'Community Leader',
        quote: 'In a proper apology you not only say that you are sorry and what you are sorry for, you also need to recognize the harm you caused and the actions you will take to remediate and prevent the behavior to repeat. Finally, you need to invite feedback from the harmed person. That’s hard work because it is mature work and demands opening up to the creation of trust.'
      },
      {
        role: 'Tech Entrepreneur',
        quote: 'Mistakes happen. Don’t overthink. Learn from your mistakes and keep moving.'
      }
    ],
    options: [
      { text: 'Focus company resources on preventing future harm rather than addressing these past problems.', align: 'non', explanation: 'Ignoring past harms perpetuates environmental injustice and fails to address the ongoing suffering of affected communities.' },
      { text: 'Take direct responsibility for comprehensive regeneration of nature and communities harmed by past operations while being transparent about how to avoid future harm.', align: 'full', explanation: 'Environmental justice requires actively repairing the harm caused by past technological decisions, not just preventing future harm.' },
      { text: 'Provide significant financial support to government-led cleanup efforts in all affected regions.', align: 'partial', explanation: 'Financial support is helpful but doesn\'t fulfill the company\'s full responsibility for direct restoration and community healing.' },
      { text: 'Publicly acknowledge past harms and document them transparently in all company communications.', align: 'partial', explanation: 'Acknowledging is important for accountability but insufficient without concrete restoration actions and community repair.' },
      { text: 'Implement strict new policies to ensure future technology deployments never cause similar environmental or health impacts anywhere in the world.', align: 'partial', explanation: 'Prevention policies are crucial but don\'t address the urgent need to repair existing damage and heal affected communities.' }
    ]
  },
  {
    code: 'S.15',
    titleLines: ['THE GREEN', 'MASK'],
    principle: 'Environmental justice in technology calls for the removal of colonial and neocolonial intentions with technology; instead, it encourages self-determination, freedom, and repatriation.',
    paragraphs: [
      'Your comprehensive restoration efforts win praise globally, but they also attract criticism from unexpected sources that you thought were supporting you. During a restoration project in Mexico, Indigenous leader Carlos Mendoza challenges your approach: \'You\'re still doing this TO us, not WITH us. You only work with us to know our problems but you still have total control on what restoration looks like, you hire the contractors, you define success. This is the same colonial pattern with a green mask.\' His words sting because you recognize their truth but it feels hard to accept given all the effort you have done throughout the years to help them. How do you fundamentally change TechFlow\'s approach?'
    ],
    advisors: [
      {
        role: 'Public Policy Expert',
        quote: 'Everyone is entitled to their opinions and we should always strive to listen to as many voices as we can. These voices can be the seeds to alternative solutions that can be further developed and lead to the economic flourishing of a whole nation.'
      },
      {
        role: 'Community Leader',
        quote: 'Sometimes, the hardest thing in the process of decolonizing oneself and a culture is not in gaining awareness of the harms of colonial way of living but in overcoming the fears embedded in it to start feeling and behaving in a different way.'
      },
      {
        role: 'Tech Entrepreneur',
        quote: 'Often, criticism is only the consequence of a poorly understood argument. Facilitate comprehension to create agreement.'
      }
    ],
    options: [
      { text: 'Identify and remove colonial patterns from all operations and work on a process to transfer real power to support Indigenous sovereignty and land rights.', align: 'full', explanation: 'Environmental justice demands actively dismantling colonial structures and supporting Indigenous sovereignty and community control.' },
      { text: 'Include more Indigenous voices and diverse perspectives in TechFlow\'s restoration and development teams.', align: 'partial', explanation: 'Representation helps but doesn\'t address the systemic colonial structures embedded in how technology development operates.' },
      { text: 'Provide comprehensive technology training and education to Indigenous and affected communities.', align: 'non', explanation: 'This can perpetuate colonial relationships by imposing external technological paradigms rather than respecting community knowledge.' },
      { text: 'Establish formal partnerships with Indigenous organizations and communities for all technology and restoration projects.', align: 'partial', explanation: 'Partnerships can be valuable but don\'t necessarily transfer real power or address underlying colonial structures in decision-making.' },
      { text: 'Study and incorporate traditional ecological knowledge and practices into all technology design and restoration work.', align: 'partial', explanation: 'Learning from traditional knowledge can be valuable but may be extractive if not done with proper respect, reciprocity, and community control.' }
    ]
  },
  {
    code: 'S.16',
    titleLines: ['THE LIVING', 'TECHNOLOGY'],
    principle: 'Environmentally just technology is not separate from nature, Earth, and the environment. Rather, it works synergistically with nature.',
    paragraphs: [
      'The process of transferring real power to communities transforms TechFlow so deeply that your CEO steps down and the board - now majoritarily composed by community members - decides that you right person for the job. Congrats, you are now TechFlow\'s CEO! But right in your first month as CEO, a news spread like wild fire in conservative media: \'Tension between communist TechFlow and terrorist Zapatista groups in Mexico amidst tech development spark Indian outrage\'. The board is agitated, even so called progressive partners are taking the bait. You talk to your team and they explain: \'The communities in Chiapas have been with us for a while now but they are threatening to build their own tech if we don\'t find a way to stop treating nature as a thing separate from us.\' How do you approach this situation?'
    ],
    advisors: [
      {
        role: 'Public Policy Expert',
        quote: 'The path towards a better future is full of conflicts. Sometimes, instead of challenging your enemy, it is much better to ignore them or simply diverge away from the source of conflict.'
      },
      {
        role: 'Community Leader',
        quote: 'There are many fancy words used these days to represent a simple but powerful truth our communities knew for a long time: humans are part of nature. However, the ways with which we interact with other forms of life can also be very different from place to place. And, although there might be general guidelines that can help us, there is no fixed and specific set of universal rules in how to establish this relationship. This should be understood and protected.'
      },
      {
        role: 'Tech Entrepreneur',
        quote: 'Be methodical with your strategy. Good intentions can drive people to take unnecessary risks with very little actual return.'
      }
    ],
    options: [
      { text: 'Implement a policy that blocks communities under control of paramilitary groups from using the technology, keeping the current systems as is while transitioning to work with non-indigenous communities only.', align: 'non', explanation: 'Communities should not be judged by regional armed conflicts and separation continues the harmful divide between technology and nature that underlies many environmental and social problems.' },
      { text: 'Avoid the news and focus on advanced biomimicry, creating technology that copies and learns from natural processes and organisms.', align: 'partial', explanation: 'Avoiding conservative traps might be useful but focusing on biomimicry only may not necessarily create the true synergistic relationships with living systems that communities need.' },
      { text: 'Publicly defend the rights of indigenous communities all around the world while creating a team to focus on a transdisciplinary R&D process to pilot technologies that works according to the community\'s relationship with life.', align: 'full', explanation: 'Environmental justice sees technology as part of, not separate from, the web of natural relationships and community life.' },
      { text: 'Give a statement that does not address your commitment with indigenous peoples but aggressively attacks violent groups and promise to prioritize design all systems to have the smallest possible environmental impact.', align: 'partial', explanation: 'Playing with ambiguity is risky and might support the status quo. Minimizing impact is good but doesn\'t create the positive, collaborative relationships with nature that the communities envision.' },
      { text: 'Build all requested technology exclusively from local, sustainable, recyclable, and renewable materials.', align: 'partial', explanation: 'Sustainable materials are important but don\'t ensure the synergistic relationships with living ecosystems and community life.' }
    ]
  },
  {
    code: 'S.17',
    titleLines: ['INCONVENIENT', 'TRUTHS'],
    principle: 'Environmentally Just Tech is intentional about harm. It is cognizant of who a given technology helps and who it harms.',
    paragraphs: [
      'Working with the communities in Chiapas creates technology that truly lives within natural systems, but it also reveals uncomfortable truths about TechFlow\'s global impact. Your community-controlled cooperatives are thriving in some places while still struggling in others. In Kenya, the technology empowers small farmers, but in Bangladesh, it\'s being captured by wealthy landowners who exclude poorer farmers. You thought this was over years ago but the problem keeps coming back and the complexity overwhelms you during a sleepless night in your Mexico City hotel. How do you address the reality that your technology may always help some while harming others?'
    ],
    advisors: [
      {
        role: 'Public Policy Expert',
        quote: 'Local groups should not worry about global problems, abstractions, and generalizations. Focus on what is right in front of you. Give them support to start and education that is relevant to their local problems. Let the experts take care of the larger perspective.'
      },
      {
        role: 'Community Leader',
        quote: 'Think global but act local. The battle may be in your backyard but it is happening everywhere. So, remember, tools are always built to serve a purpose that aligns with one’s way of being in this world and reinforced by the systems of incentives and punishments in place. Every tool can be used in different ways and have multiple purposes, many of which can be hidden until it has developed enough to show its ‘true’ face. It’s important to tread carefully then.'
      },
      {
        role: 'Tech Entrepreneur',
        quote: 'People are concerned? So, let them voice their concerns. They will feel better after that. Then promote the concerns that are aligned to your strategy and ignore the rest. You can’t do everything, anyways.'
      }
    ],
    options: [
      { text: 'Conduct comprehensive impact assessments before each new cooperative begins operating, making sure that all projects are following strict guidelines and adapting them to each local context.', align: 'partial', explanation: 'Impact assessments are important but don\'t ensure ongoing, active attention to who benefits and who is harmed over time.' },
      { text: 'Provide regular training for all cooperative members on identifying and addressing potential negative impacts.', align: 'partial', explanation: 'Training raises awareness but doesn\'t ensure systematic attention to harm nor actual support throughout all development and deployment processes.' },
      { text: 'Establish ethics committees and review boards with global experts to evaluate how the technology impacts the communities.', align: 'non', explanation: 'Expert committees can help but don\'t ensure day-to-day intentionality about harm in actual operations and community relationships (they may even reproduce colonial patterns).' },
      { text: 'Develop comprehensive ethical guidelines and standards to be followed consistently through systems of incentive and punishment.', align: 'non', explanation: 'Standards provide minimum guidance but don\'t ensure active, ongoing attention to who is helped and harmed in each context.' },
      { text: 'Commit to break the myth of tech neutrality, being cognizant of how tech will always be influenced by the larger socio-economic system in place requiring continuous assessment of who it helps and harms and how to improve.', align: 'full', explanation: 'Intentionality about harm requires continuous vigilance and action, not just initial assessment or periodic reviews.' }
    ]
  },
  {
    code: 'S.18',
    titleLines: ['DEMOCRATIC', 'CRISIS'],
    principle: 'Environmental justice in technology demands that democracy be the foundation of all of its endeavors. A democratic and community-centric environment is necessary to have a just world.',
    paragraphs: [
      'Your commitment to addressing systemic harm leads to a major reorganization of the global cooperative network. However, this creates a new challenge: the network has grown so large that decision-making is becoming unwieldy. Some cooperatives want centralized efficiency, others demand local autonomy. The tension comes to a head during a heated video conference with the cooperative representatives. Fatima from Detroit argues: \'We need faster decisions to compete with big tech.\' But James from Ghana counters: \'Speed kills democracy.\' As the leading figure and network\'s founding architect, everyone looks to you for guidance. What structure do you propose?'
    ],
    advisors: [
      {
        role: 'Public Policy Expert',
        quote: 'There are times when standardization is necessary to overcome the overwhelming complexity of managing multiple perspectives. But the standardization itself should be done through actual collaboration with the multitude of views you are dealing with.'
      },
      {
        role: 'Community Leader',
        quote: 'True accountability is the result of the ability to make decisions along with the opportunity to learn and adapt with the consequences of these decisions.'
      },
      {
        role: 'Tech Entrepreneur',
        quote: 'Human life is short and, thus, our decisions should be quick. It is naive to think that large scale collaboration can be efficient. Sure, it can bring some interesting ideas sometimes, but it is just too slow. So, listen to others but if that is taking too long, be a leader and decide yourself.'
      }
    ],
    options: [
      { text: 'Organize regular global assemblies where all representatives can discuss and debate network-wide decisions.', align: 'non', explanation: 'Global assemblies are valuable but don\'t necessarily give each community real decision-making power over technology affecting them.' },
      { text: 'Ensure that each affected community maintains actual local power to make binding decisions about technology that impacts their lives independent of suggestions from global advisory councils.', align: 'full', explanation: 'True democratic technology requires communities to have actual authority over their technological futures, not just input opportunities.' },
      { text: 'Create advisory councils with representatives from each cooperative to guide network-wide policy decisions.', align: 'non', explanation: 'While debate is important, advisory structures often lack real power and can even be used to legitimize decisions made elsewhere in the network.' },
      { text: 'Start public-private partnership models that include cooperative representatives as advisors in local governance structures.', align: 'non', explanation: 'Advisory roles lack real decision power and public-private partnerships often prioritize efficiency and external interests over genuine community needs and self-determination.' },
      { text: 'Invite community representatives to join a central coordinating board with decision-making authority for large global network issues.', align: 'partial', explanation: 'Central board representation can provide some influence but doesn\'t ensure community control over local technology decisions.' }
    ]
  },
  {
    code: 'S.19',
    titleLines: ['DATA', 'SOVEREIGNTY'],
    principle: 'Environmental justice in technology calls for the removal of colonial and neocolonial intentions with technology; instead, it encourages self-determination, freedom, and repatriation.',
    paragraphs: [
      'The democratic restructuring works, but it surfaces a critical issue that\'s been simmering all this time: data sovereignty. The cooperative network has accumulated vast amounts of community data - agricultural patterns, health trends, economic flows, social relationships - they can access it but it is all in TechFlow\'s dataservers. Now governments, researchers, and corporations are demanding access. The European Union offers a trade deal contingent on data sharing. The UN wants health data for pandemic preparedness. Tech giants offer millions for purchasing patterns. Community leader Amara from Brazil cuts through the noise: \'This is our information, about our lives, our land, our children. We should decide what happens to it!\' What\'s your position?'
    ],
    advisors: [
      {
        role: 'Public Policy Expert',
        quote: 'Not everything can be tackled by simple frameworks. There are moments when decisions will demand a more complicated approach to deal with the complexity of multiple voices.'
      },
      {
        role: 'Community Leader',
        quote: 'The problem with taking the collaborative community-centered approach is that it is a road that takes you farther away from centralized control. But one can only move past centralized control when they overcome the traumas and fears created by the colonial culture.'
      },
      {
        role: 'Tech Entrepreneur',
        quote: 'Dealing with private data is very tricky and sometimes it is best to create a layer that distances you from any potential risk in dealing with the data. But risks also bring opportunities, some of which can help social and scientific development.'
      }
    ],
    options: [
      { text: 'Allow cooperatives to control data with strong privacy policies and security measures protecting community information.', align: 'full', explanation: 'Cooperative control is better than corporate control, but it only ensures community sovereignty over their own information if the community finds itself represented by the cooperative.' },
      { text: 'Provide the data only to democratic governments to ensure data is used for legitimate public benefit and scientific research.', align: 'non', explanation: 'While regulations and laws for data protection are important, government oversight doesn\'t ensure community self-determination over their data.' },
      { text: 'Ensure that communities and individuals maintain complete control over their own data, being directly involved in discussions and holding the final decision about data access and use.', align: 'full', explanation: 'Data sovereignty means communities control their own information, supporting self-determination and preventing exploitation by outside entities.' },
      { text: 'Establish independent third-party organizations to serve as neutral custodians of all community data.', align: 'non', explanation: 'Third-party custodians may be preferable to corporate and government control, but unless directly and majoritarily represented by community members they still don\'t give communities direct sovereignty over their information.' },
      { text: 'Create multi-stakeholder governance bodies that include community representatives to oversee global data use decisions.', align: 'partial', explanation: 'Multi-stakeholder approaches can include community voices but may dilute community control over their own information and lives.' }
    ]
  }
];

// Every option is scored from its alignment, so the numbers exist in exactly
// one place. Authoring a card means choosing full/partial/non and nothing else.
export const SCENARIOS = SCENARIO_DECK.map((scenario) => ({
  ...scenario,
  options: scenario.options.map((option) => ({ ...option, score: ALIGN_POINTS[option.align] })),
}));

// The closing card. It is not a scenario: nothing is scored and there are no
// options -- the player writes their own vision instead. It is deliberately
// kept out of SCENARIOS so the score range, quadrants.json and the results
// charts all stay keyed to the nineteen graded cards, and so it can be shown
// at the end of every game whether ten cards were played or all nineteen.
export const VISION_CHAR_LIMIT = 200;

export const VISION_CARD = {
  code: 'S.20',
  titleLines: ['THE', 'VISION'],
  paragraphs: [
    '20 years have passed since you first walked into TechFlow.',
    'Now, you stand before the largest assembly of technology cooperatives in the world, representing 10,000 communities worldwide. They want to be part of TechFlow\u2019s cooperative community of 8,000 communities world-wide. They believe TechFlow is an example of how technology can take a strong and radical stance to help communities and the planet.',
    'However, they say that the Climate Crisis has created a tough context for the next generation of technology. Children who were born when you started your journey are now young adults asking what kind of technological world they\'ll inherit and how these technologies would bring actual hope to them. Your actions will guide the development of technology that could reach a billion people. As you look out at faces from every continent, you feel nervous, as if holding the weight of the world on your shoulders. All those years and here you are feeling like you never worked on this before, that you have no idea what you are doing\u2026feeling like a complete imposter. You breathe deep and realize this is your moment to embody everything you\'ve learned about environmental justice and technology.',
    'What vision do you offer for the future?'
  ],
  advisors: [
    {
      role: 'Public Policy Expert',
      quote: 'The present is not perfect but I am sure you now know a way to make it a bit better.'
    },
    {
      role: 'Community Leader',
      quote: 'We are with you on this one and proud of everything you have learned and will learn still. The future you chose will determine the relationships you have with everyone and everything around you.'
    },
    {
      role: 'Tech Entrepreneur',
      quote: 'The only future you can envision is your own future.'
    }
  ]
};

// Gauge is cumulative across every scenario: -5..+5 per question --
// non-aligned -5, partially aligned +2, fully aligned +5. Zero is the middle
// of the range now, not the floor: a non-aligned answer costs as much as a
// fully aligned one earns.
export const SCORE_PER_CARD_MIN = ALIGN_POINTS.non;
export const SCORE_PER_CARD_MAX = ALIGN_POINTS.full;
export const SCORE_MIN = SCENARIOS.length * SCORE_PER_CARD_MIN;
export const SCORE_MAX = SCENARIOS.length * SCORE_PER_CARD_MAX;

// Dev Mode's deck: four cards, one per quadrant of the results spider chart,
// so a whole run reaches the results screen in a couple of minutes instead of
// nineteen cards later.
//
// The pick for each quadrant is the card whose principle states that
// quadrant's theme most plainly. Scenario 17 is deliberately unused -- it is
// the one card listed under two quadrants, so it would stand for both at once.
const DEV_DECK_PICKS = [
  ['power_positionality', 1],     // S.01, DAY 1 AT TECH FLOW -- explicitly anti-racist
  ['collective_flourishing', 2],  // S.02, INNOVATION CHALLENGE -- responsible innovation
  ['access_accountability', 10],  // S.10, PATENTS AND THE PRESSURE FOR REVENUE -- open source
  ['technology_nature', 16],      // S.16, THE LIVING TECHNOLOGY -- synergistic with nature
];

const SCENARIOS_BY_QUADRANT = Object.fromEntries(
  quadrantMap.quadrants.map((quadrant) => [quadrant.slug, quadrant.scenarios])
);

export const DEV_DECK = DEV_DECK_PICKS.map(([slug, picked]) => {
  // Derived from quadrants.json rather than hardcoded, so the deck cannot
  // quietly stop covering all four quadrants: if the map ever drops the picked
  // card from its quadrant, that quadrant's first card stands in instead.
  const inQuadrant = SCENARIOS_BY_QUADRANT[slug] ?? [];
  const number = inQuadrant.includes(picked) ? picked : inQuadrant[0];
  return SCENARIOS[number - 1];
}).filter(Boolean);
