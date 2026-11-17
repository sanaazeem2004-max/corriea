import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Briefcase, Compass, MessagesSquare, UserRound, Users } from 'lucide-react';
import justiceImg from '../assets/justice.jpg';
import { FIRM } from '../data/content';
import { Button, Eyebrow, Reveal, rise, stagger } from './ui';

// Qualities drawn from how the firm describes its own work — no awards or outcomes claimed.
const PILLARS = [
  { icon: UserRound, title: 'Personalized guidance', text: 'Advice shaped around the results you want to achieve, not a template.' },
  { icon: Compass, title: 'Strategic thinking', text: 'Thorough research and proactive planning before decisions are made.' },
  { icon: MessagesSquare, title: 'Clear communication', text: 'We explain your options plainly, so you understand every step.' },
  { icon: Briefcase, title: 'Business understanding', text: 'Legal expertise paired with practical business instinct.' },
  { icon: Users, title: 'Client-focused', text: 'Flexible representation that adapts as your priorities change.' },
];

export default function WhyChooseUs() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);

  return (
    <section ref={ref} aria-labelledby="why-title" className="grain grid bg-ink text-white lg:grid-cols-2">
      {/* Left panel: content box aligns to the shared 1680px container edge */}
      <div className="section-y">
        <div className="container-x lg:mr-0 lg:ml-auto lg:w-[min(840px,calc(100%-64px))] lg:max-w-none lg:pr-16">
          <Eyebrow tone="dark">Why Correia Law Firm</Eyebrow>
          <Reveal>
            <h2 id="why-title" className="display-lg mt-6">
              A thoughtful approach to <em className="text-bronze">every matter.</em>
            </h2>
          </Reveal>

          <motion.ul
            className="mt-12 grid gap-x-10 gap-y-9 sm:grid-cols-2"
            variants={stagger(0.09)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '0px 0px -10% 0px' }}
          >
            {PILLARS.map(({ icon: Icon, title, text }) => (
              <motion.li key={title} variants={rise} className="group">
                <span className="grid size-12 place-items-center border border-bronze/40 text-bronze transition-colors duration-500 group-hover:bg-bronze group-hover:text-ink">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="mt-5 font-serif text-[1.5rem] font-semibold leading-tight">{title}</h3>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-white/65">{text}</p>
              </motion.li>
            ))}
            <motion.li variants={rise} className="flex items-end">
              <Button href={FIRM.bookUrl} variant="outline">Start a conversation</Button>
            </motion.li>
          </motion.ul>
        </div>
      </div>

      {/* Right panel: full-bleed photograph */}
      <div className="relative min-h-[420px] overflow-hidden sm:min-h-[520px] lg:min-h-full">
        <motion.img
          src={justiceImg}
          alt="Bronze statue of Lady Justice holding the scales"
          loading="lazy"
          decoding="async"
          style={{ y: imgY }}
          className="absolute inset-x-0 top-[-8%] h-[116%] w-full object-cover object-center"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-ink/40 via-umber/10 to-transparent mix-blend-multiply" />
        <motion.blockquote
          className="absolute inset-x-5 bottom-5 bg-ink/80 p-7 backdrop-blur-md md:inset-x-10 md:bottom-10 lg:left-10 lg:right-auto lg:max-w-[420px]"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          <p className="font-serif text-[1.375rem] italic leading-snug">
            “Whether you have questions about getting started on a new endeavor, are seeking solutions to an existing challenge, or want to prepare for the future, we are
            here to guide you home.”
          </p>
          <footer className="eyebrow mt-4 text-bronze">Correia Law Firm</footer>
        </motion.blockquote>
      </div>
    </section>
  );
}
