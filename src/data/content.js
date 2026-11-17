// All firm copy below is taken from https://thecorreialawfirm.com/ (inspected 17 Nov 2026).
// Short "summary" lines are condensed from that copy; nothing new is claimed.
import psychedelicImg from '../assets/pa-psychedelic.jpg';
import estateImg from '../assets/pa-estate.jpg';
import businessImg from '../assets/pa-business.jpg';
import realEstateImg from '../assets/pa-realestate.jpg';
import elderImg from '../assets/pa-elder.jpg';
import generalImg from '../assets/pa-general.jpg';

export const FIRM = {
  name: 'Correia Law Firm',
  phone: '619.251.1432',
  phoneHref: 'tel:+16192511432',
  email: 'info@correia.law',
  emailHref: 'mailto:info@correia.law',
  street: '4150 Voltaire Street',
  city: 'San Diego, CA 92107',
  directions:
    'https://maps.google.com/?q=4150%20Voltaire%20Street%20San%20Diego,%20CA%2092107',
  // Preserved destinations from the original site
  bookUrl: 'https://thecorreialawfirm.cliogrow.com/book',
  intakeUrl:
    'https://thecorreialawfirm.cliogrow.com/intake/78a22793f51fcedc1e0f7938f3575ff5',
  clientLoginUrl: 'https://clients.clio.com/',
  privacyUrl: 'https://thecorreialawfirm.com/privacy-policy',
  termsUrl: 'https://thecorreialawfirm.com/terms-and-conditions',
  newsletterUrl: 'https://www.enlightenedequire.com/',
  social: {
    linkedin: 'https://www.linkedin.com/in/dejacorreia',
    instagram: 'https://www.instagram.com/correialawfirm/',
    blog: 'https://www.enlightenedequire.com/',
  },
};

export const NAV = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'practice-areas', label: 'Practice Areas' },
  { id: 'attorney', label: 'Our Attorney' },
  { id: 'contact', label: 'Contact' },
];

export const INTRO =
  'Correia Law Firm is dedicated to understanding the results you want to achieve, educating you on actions that can be taken by you and on your behalf, and empowering you to move through an expertly crafted path of success. Whether you have questions about getting started on a new endeavor, are seeking solutions to an existing challenge, or want to prepare for the future, we are here to guide you home.';

export const PRACTICE_AREAS = [
  {
    slug: 'psychedelic-law',
    title: 'Psychedelic Law',
    image: psychedelicImg,
    alt: 'Mist drifting over an evergreen forest',
    summary:
      'Regulatory advice, therapeutic organization and governance, indigenous and religious use protections, entity formation, real estate planning and contract negotiation.',
    services: [
      'Regulatory Advice',
      'Therapeutic Organization and Governance',
      'Indigenous and Religious Use Protections and Honoring',
      'Entity Formation and Governance',
      'Real Estate Site Planning, Acquisitions, Entitlement, and Negotiations',
      'Contract Negotiations and Drafting',
    ],
    body: [
      'What is Psychedelic Law? Efforts to decriminalize, research, and reschedule entheogens such as psilocybin (mushrooms), Dimethyltryptamine (DMT), Methylenedioxymethamphetamine (MDMA), among others are rapidly spreading through the state, local, and federal level. Presently, all remain on the Department of Drug Enforcement’s Schedule I drug list defined as “no known medical use.” Clinical trials around the world seem to challenge that definition.',
      'If you have questions about navigating a psychedelic business, religious endeavor, or other questions about the quickly evolving regulations surrounding psychedelic services, call today.',
    ],
  },
  {
    slug: 'estate-planning',
    title: 'Estate Planning and Probate',
    image: estateImg,
    alt: 'A hand signing a document with a fountain pen',
    summary:
      'Wills, trusts, probate, powers of attorney, guardianships and special needs planning.',
    services: ['Wills', 'Trusts', 'Probate', 'Powers of Attorney', 'Guardianships', 'Special Needs'],
    body: [
      'Do not leave the future of your legacy to chance. Estate planning, in legal terms, is the proactive process of arranging for the management and distribution of your assets, and care for your loved ones and pets in the event of your incapacitation or passing. Not just for the wealthy, estate planning endeavors to ensure your wishes are honored, minimize taxes and probate costs, and assists in avoiding family disputes that could disrupt your loved ones for years to come.',
    ],
  },
  {
    slug: 'business',
    title: 'Business Contracts, Formation and Litigation',
    image: businessImg,
    alt: 'Two professionals shaking hands across a desk',
    summary:
      'Business formation, governance, acquisitions and sales, contracts, negotiations and litigation.',
    services: ['Formation', 'Governance', 'Acquisitions and Sales', 'Contracts and Negotiation', 'Litigation'],
    body: [
      'Starting a new business is an exciting venture, but navigating the legal complexities of business formation and governance can be daunting. From choosing the right legal structure to ensuring compliance with all local, state, and federal regulations, taxation, and future growth, Correia Law Firm is here to assist. Legal assistance includes review of existing business structures and operations, business formation and providing comprehensive guidance to help entrepreneurs establish a solid legal foundation.',
    ],
  },
  {
    slug: 'real-estate',
    title: 'Residential and Commercial Real Estate',
    image: realEstateImg,
    alt: 'A modern home with warm interior lights at dusk',
    summary:
      'Acquisitions, dispositions, land use, planning, commercial leasing, contracts and litigation.',
    services: [
      'Acquisitions and Dispositions',
      'Entitlement, Land Use, and Planning',
      'Commercial Leasing',
      'Contract Negotiation',
      'Litigation',
    ],
    body: [
      'Whether you are investing in your first or fifth home, whether you are buying a new space for your business or protecting your investment from others, Correia Law Firm is ready to assist.',
    ],
  },
  {
    slug: 'elder-abuse',
    title: 'Elder Abuse',
    image: elderImg,
    alt: 'An older couple walking arm in arm along a garden path',
    summary:
      'Legal support for protecting older adults from abuse, neglect and financial exploitation.',
    services: ['Physical and Emotional Abuse', 'Neglect', 'Financial Exploitation'],
    body: [
      'Protection of the elderly is everyone’s responsibility.',
      'If you suspect an elder is experiencing abuse, neglect, or financial exploitation, do not wait! In legal terms, elder abuse covers a wide range of harmful acts, from physical violence and emotional torment, to critical neglect and theft of assets.',
      'Correia Law Firm is dedicated to protecting the rights and dignity of older adults. We understand the legal framework surrounding the complexities of elder abuse, and are here to provide compassionate, effective representation to secure justice and hold abusers accountable.',
    ],
  },
  {
    slug: 'general-practice',
    title: 'General Legal Practice',
    image: generalImg,
    alt: 'A sunlit footpath leading through a forest',
    summary:
      'Guidance for clients who need help identifying the appropriate legal path.',
    services: ['Initial Consultation', 'Referral Network'],
    body: [
      'Do you have a legal question and are not sure whether Correia Law Firm is the right firm, or are you unsure of even where to start?',
      'Correia Law Firm has the resources and connections to get you started on the right path whether it is with an attorney in our firm or another from our vast referral network. Schedule a consultation today to discuss your unique matter with a Correia Law Firm attorney.',
    ],
  },
];

export const ATTORNEY = {
  name: 'Deja Correia',
  title: 'Attorney',
  bio: [
    'Deja Correia has earned a reputation as a hands-on leader, empowering trainer, collaborator, and compliance guru. She excels in communication and believes passionately in the power of well-written works. Deja considers thorough research, proactivity, and conducting business with a focus on meeting the intended end-results with the flexibility to react to dynamically changing priorities an indispensable skill and necessary talent.',
    'Deja Correia lives and works in the Point Loma / Ocean Beach area of San Diego. She is a wife, mother, and philanthropic community member.',
  ],
  memberships: [
    'The State Bar of California',
    'California Lawyers Association',
    'San Diego County Bar Association',
    'The Psychedelic Bar Association',
  ],
};

export const DISCLAIMER = [
  {
    title: 'No Duty of Confidentiality',
    text: 'Do not send unsolicited information via email until you have spoken directly with a lawyer and have been instructed to do so. If you are inquiring about services and representation, please send an inquiry including only names of the parties and general information pertaining to the issue (i.e. real estate contract dispute, interested in starting a corporation, etc.). Once a conflict check has been completed and I have ensured there is no conflict between your situation and that of any other Correia Law Firm client, you may receive authorization from to send additional information. Sending unsolicited confidential information may not be subject to ANY privilege. The Correia Law Firm has no duty to keep any unsolicited information confidential, unless I later agree to represent you. Receipt of unsolicited information will also not prevent The Correia Law Firm from representing another party in any matter in which that information may be relevant or from using that information in any other way.',
  },
  {
    title: 'No Attorney-Client Relationship',
    text: 'Merely sending information, requesting information, or contacting a lawyer or other employee does not create an attorney-client relationship. Such a relationship is created only after an agreement has been reached between you and your attorney clearly stating they will represent you in a specific matter. If you are interested in hiring an attorney, we welcome the opportunity to discuss this with you further. NOTE: Again, do not send any confidential information without receiving explicit authorization from The Correia Law Firm to do so. While I welcome inquiries, I may not provide responses to every inquiry and reserve the right to respond to at my sole discretion.',
  },
  {
    title: 'Changes to Disclaimers',
    text: 'The Correia Law Firm reserves the right to alter, change, or supplement disclaimers, policies, and conditions of use at any time without notice to prior, current, or prospective site users.',
  },
];
