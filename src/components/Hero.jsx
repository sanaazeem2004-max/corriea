import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Phone, MapPin, CalendarCheck, ArrowDown } from 'lucide-react';
import heroImg from '../assets/hero-library.jpg';
import { FIRM } from '../data/content';
import { Button, EASE } from './ui';

const LINES = [
  { text: 'Legal Expertise.', accent: false },
  { text: 'Business Instinct.', accent: true },
  { text: 'Committed Counsel.', accent: false },
];

const STRIP = [
  { icon: Phone, label: 'Call the firm', value: FIRM.phone, href: FIRM.phoneHref },
  { icon: MapPin, label: 'Visit the office', value: '4150 Voltaire St, San Diego', href: FIRM.directions },
  { icon: CalendarCheck, label: 'Consultations', value: 'Book online', href: FIRM.bookUrl },
];

export default function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '22%']);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section id="home" ref={ref} className="relative flex min-h-[min(100svh,900px)] flex-col overflow-hidden bg-ink text-white">
      {/* Background photograph with slow settle + parallax */}
      <motion.div className="absolute inset-0" style={{ y: imgY }} aria-hidden="true">
        <motion.img
          src={heroImg}
          alt=""
          fetchPriority="high"
          className="h-[115%] w-full object-cover object-[60%_center]"
          initial={{ scale: 1.15, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2.4, ease: EASE }}
        />
      </motion.div>
      {/* Tonal overlays: charcoal from the left, warm umber from below */}
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/35" />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink via-umber/25 to-ink/40 mix-blend-multiply" />
      <div aria-hidden="true" className="grain absolute inset-0" />

      {/* Vertical guide lines echo the editorial grid */}
      <div aria-hidden="true" className="container-x pointer-events-none absolute inset-0 hidden lg:block">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="absolute top-0 h-full w-px bg-white/[0.06]"
            style={{ left: `${(i + 1) * 25}%`, transformOrigin: 'top' }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 1.6, ease: EASE, delay: 0.3 + i * 0.12 }}
          />
        ))}
      </div>

      <motion.div
        style={{ y: contentY, opacity: fade }}
        className="container-x relative flex flex-1 flex-col justify-center pb-14 pt-32 md:pb-16 lg:pt-32"
      >
        <motion.div
          className="mb-5 flex items-center gap-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 0.5 }}
        >
          <motion.span
            className="block h-px w-12 bg-bronze"
            style={{ transformOrigin: 'left' }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, ease: EASE, delay: 0.6 }}
          />
          <span className="eyebrow text-bronze"><span className="hidden sm:inline">Correia Law Firm · </span>San Diego, California</span>
        </motion.div>

        <h1 className="display-xl">
          {LINES.map((line, i) => (
            <span key={line.text} className="-mb-[0.06em] block overflow-hidden pb-[0.06em]">
              <motion.span
                className={`block ${line.accent ? 'italic text-bronze' : ''}`}
                initial={{ y: '110%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 1.2, ease: EASE, delay: 0.65 + i * 0.14 }}
              >
                {line.text}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          className="mt-6 max-w-[46ch] text-base leading-relaxed text-white/75 md:text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 1.2 }}
        >
          Thoughtful legal guidance for individuals, families and businesses navigating life’s most
          important decisions.
        </motion.p>

        <motion.div
          className="mt-8 flex flex-col gap-4 sm:flex-row"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 1.35 }}
        >
          <Button href="#practice-areas" variant="outline">
            Explore Our Services
          </Button>
          <Button href={FIRM.bookUrl}>Book a Consultation</Button>
        </motion.div>
      </motion.div>

      {/* Info strip — the composition anchor along the bottom edge */}
      <motion.div
        className="relative hidden border-t border-white/10 bg-ink/55 backdrop-blur-sm md:block"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, ease: EASE, delay: 1.5 }}
      >
        <div className="container-x grid grid-cols-4">
          {STRIP.map(({ icon: Icon, label, value, href }) => (
            <a
              key={label}
              href={href}
              {...(/^https?:/.test(href) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="group flex items-center gap-4 border-r border-white/10 py-7 pr-6 [&:not(:first-child)]:pl-6"
            >
              <Icon className="size-5 shrink-0 text-bronze" aria-hidden="true" />
              <span className="min-w-0">
                <span className="block text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-white/50">{label}</span>
                <span className="mt-1 block truncate text-sm font-medium text-white transition-colors group-hover:text-bronze">
                  {value}
                </span>
              </span>
            </a>
          ))}
          <a href="#about" className="group flex items-center justify-end gap-3 py-7 pl-6 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-white/60 hover:text-white">
            Scroll to discover
            <span className="grid size-9 place-items-center rounded-full border border-white/20 transition-colors group-hover:border-bronze">
              <motion.span animate={{ y: [0, 4, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>
                <ArrowDown className="size-4" aria-hidden="true" />
              </motion.span>
            </span>
          </a>
        </div>
      </motion.div>
    </section>
  );
}
