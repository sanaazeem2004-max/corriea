import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Phone, X } from 'lucide-react';
import { FIRM, PRACTICE_AREAS } from '../data/content';
import { Button, EASE, Eyebrow, Reveal, TextLink, rise, stagger } from './ui';

function PracticeCard({ area, index, onOpen }) {
  return (
    <motion.article
      variants={rise}
      className="group relative flex h-full flex-col bg-white shadow-[0_1px_0_rgba(16,21,22,0.06),0_24px_48px_-28px_rgba(16,21,22,0.35)] transition-transform duration-700 ease-[var(--ease-out-expo)] hover:-translate-y-2"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-mist">
        <img
          src={area.image}
          alt={area.alt}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-[1400ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.07]"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/55 via-ink/0 to-ink/0" />
        <span className="absolute bottom-4 left-6 font-serif text-[2.5rem] italic leading-none text-white/90">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6 md:p-7">
        <h3 className="display-md text-ink">{area.title}</h3>
        <p className="mt-3 flex-1 text-[0.9375rem] leading-relaxed text-ink/65">{area.summary}</p>
        <div className="mt-6 border-t border-ink/10 pt-5">
          <TextLink as="button" onClick={() => onOpen(area)}>
            Learn more<span className="sr-only"> about {area.title}</span>
          </TextLink>
        </div>
      </div>

      {/* Copper rule grows along the bottom on hover */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-0 bg-copper transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-x-100"
      />
    </motion.article>
  );
}

function PracticeDrawer({ area, onClose }) {
  const closeRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement;
    closeRef.current?.focus();
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab' && panelRef.current) {
        const f = panelRef.current.querySelectorAll('a[href], button');
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      previouslyFocused?.focus?.();
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-labelledby="practice-title">
      <motion.div
        className="absolute inset-0 bg-ink/70 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        ref={panelRef}
        className="absolute inset-y-0 right-0 flex w-full max-w-[640px] flex-col overflow-y-auto bg-paper"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        <div className="relative aspect-[16/9] shrink-0 overflow-hidden">
          <motion.img
            src={area.image}
            alt={area.alt}
            className="h-full w-full object-cover"
            initial={{ scale: 1.15 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.4, ease: EASE }}
          />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/80 to-ink/10" />
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-5 top-5 grid size-11 place-items-center bg-paper text-ink transition-colors hover:bg-bronze"
          >
            <X className="size-5" />
          </button>
          <div className="absolute inset-x-0 bottom-0 p-7 md:p-10">
            <p className="eyebrow text-bronze">Practice Area</p>
            <h3 id="practice-title" className="display-lg mt-3 text-[clamp(2rem,4vw,2.75rem)] text-white">
              {area.title}
            </h3>
          </div>
        </div>

        <div className="flex-1 p-7 md:p-10">
          <ul className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
            {area.services.map((s) => (
              <li key={s} className="flex items-start gap-3 text-[0.9375rem] font-medium text-ink">
                <Check className="mt-0.5 size-4 shrink-0 text-copper" aria-hidden="true" />
                {s}
              </li>
            ))}
          </ul>
          <div className="mt-8 space-y-4 border-t border-ink/10 pt-8 text-[1rem] leading-relaxed text-ink/75">
            {area.body.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
        </div>

        <div className="sticky bottom-0 flex flex-col gap-3 border-t border-ink/10 bg-paper p-7 sm:flex-row md:px-10">
          <Button href={FIRM.bookUrl} className="flex-1">Book a Consultation</Button>
          <Button href={FIRM.phoneHref} variant="outline" tone="light" icon={false} className="flex-1">
            <span className="inline-flex items-center gap-2">
              <Phone className="size-4" aria-hidden="true" /> {FIRM.phone}
            </span>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

export default function PracticeAreas() {
  const [selected, setSelected] = useState(null);
  const close = useCallback(() => setSelected(null), []);

  return (
    <section id="practice-areas" className="relative bg-paper pb-[88px] md:pb-[112px] lg:pb-[136px]">
      {/* Dark band the cards rise out of */}
      <div aria-hidden="true" className="grain absolute inset-x-0 top-0 h-[560px] bg-ink md:h-[520px]" />

      <div className="container-x relative pt-[88px] md:pt-[112px] lg:pt-[136px]">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-16">
          <div className="lg:col-span-6">
            <Eyebrow tone="dark">Areas of Practice</Eyebrow>
            <Reveal>
              <h2 className="display-lg mt-6 text-white">
                Counsel for the moments that <em className="text-bronze">matter most.</em>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.1} className="lg:col-span-6">
            <p className="text-[1.0625rem] leading-relaxed text-white/70">
              At Correia Law Firm, we provide the following legal services — from planning your
              legacy and structuring a business to navigating one of the fastest-evolving areas of
              law in California.
            </p>
          </Reveal>
        </div>

        <motion.div
          className="mt-14 grid gap-6 md:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-8"
          variants={stagger(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '0px 0px -8% 0px' }}
        >
          {PRACTICE_AREAS.map((area, i) => (
            <PracticeCard key={area.slug} area={area} index={i} onOpen={setSelected} />
          ))}
        </motion.div>
      </div>

      <AnimatePresence>
        {selected && <PracticeDrawer key={selected.slug} area={selected} onClose={close} />}
      </AnimatePresence>
    </section>
  );
}
