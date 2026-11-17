import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import aboutImg from '../assets/about-meeting.jpg';
import { FIRM, INTRO } from '../data/content';
import { Eyebrow, ImageReveal, Reveal, TextLink, EASE, rise, stagger } from './ui';

// The firm's own three-part promise, taken from its introduction.
const STEPS = [
  { n: '01', title: 'Understand', text: 'We start with the results you want to achieve.' },
  { n: '02', title: 'Educate', text: 'Clear explanations of the actions open to you, and those we take on your behalf.' },
  { n: '03', title: 'Empower', text: 'An expertly crafted path you can move through with confidence.' },
];

export default function About() {
  return (
    <section id="about" className="section-y bg-paper">
      <div className="container-x grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
        {/* Left — copy */}
        <div className="lg:col-span-6">
          <Eyebrow>About the Firm</Eyebrow>
          <Reveal>
            <h2 className="display-lg mt-6 text-ink">
              Guidance That <em className="text-copper">Moves</em> You Forward.
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="mt-8 border-l-2 border-copper/70 pl-6 text-[1.0625rem] leading-relaxed text-ink/75">
              {INTRO}
            </p>
          </Reveal>

          <motion.ol
            className="mt-12 grid gap-px overflow-hidden border border-ink/10 bg-ink/10 sm:grid-cols-3"
            variants={stagger(0.12)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '0px 0px -10% 0px' }}
          >
            {STEPS.map((s) => (
              <motion.li key={s.n} variants={rise} className="bg-paper p-6">
                <span className="font-serif text-lg italic text-copper-deep">{s.n}</span>
                <h3 className="mt-3 font-serif text-2xl font-semibold text-ink">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/65">{s.text}</p>
              </motion.li>
            ))}
          </motion.ol>

          <Reveal delay={0.1} className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-8">
            <TextLink href="#attorney">Meet the attorney</TextLink>
            <span className="text-sm text-ink/60">
              Learn about our impact in the legal community —{' '}
              <a
                href={FIRM.newsletterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-copper-deep underline decoration-copper/40 underline-offset-4 hover:decoration-copper"
              >
                subscribe here
              </a>
              .
            </span>
          </Reveal>
        </div>

        {/* Right — image with copper top rule and overlapping location card */}
        <div className="relative lg:col-span-6">
          <motion.span
            aria-hidden="true"
            className="absolute -top-3 left-0 z-10 block h-[3px] w-full bg-copper"
            style={{ transformOrigin: 'left' }}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: EASE, delay: 0.3 }}
          />
          <ImageReveal
            src={aboutImg}
            alt="Colleagues reviewing documents together around a conference table"
            className="aspect-[4/5] w-full sm:aspect-[5/4] lg:aspect-[4/5] 2xl:aspect-square"
          />
          <Reveal
            delay={0.5}
            className="relative -mt-16 ml-auto w-[88%] bg-ink p-7 text-white shadow-2xl shadow-ink/30 sm:w-[70%] lg:absolute lg:bottom-10 lg:-left-12 lg:mt-0 lg:ml-0 lg:w-[62%]"
          >
            <div className="flex items-start gap-4">
              <MapPin className="mt-1 size-5 shrink-0 text-bronze" aria-hidden="true" />
              <div>
                <p className="eyebrow text-bronze">Serving San Diego, California</p>
                <p className="mt-3 font-serif text-2xl leading-snug">
                  {FIRM.street}
                  <br />
                  {FIRM.city}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
