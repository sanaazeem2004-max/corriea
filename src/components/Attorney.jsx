import { motion } from 'framer-motion';
import { Award } from 'lucide-react';
import dejaImg from '../assets/deja-correia.jpg';
import { ATTORNEY, FIRM } from '../data/content';
import { Button, EASE, Eyebrow, ImageReveal, LinkedinIcon, Reveal, rise, stagger } from './ui';

export default function Attorney() {
  return (
    <section id="attorney" className="section-y bg-paper-2">
      <div className="container-x grid gap-14 lg:grid-cols-12 lg:gap-16">
        {/* Portrait */}
        <div className="relative lg:col-span-5">
          <div className="relative lg:sticky lg:top-28">
            {/* Offset frame behind the photo */}
            <motion.span
              aria-hidden="true"
              className="absolute -bottom-6 -right-6 left-8 top-8 hidden border border-copper/60 lg:block"
              initial={{ opacity: 0, x: -12, y: -12 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: EASE, delay: 0.6 }}
            />
            <ImageReveal
              src={dejaImg}
              alt="Portrait of attorney Deja Correia"
              className="relative aspect-[4/5] w-full bg-ink"
              imgClassName="object-[50%_30%]"
            />
            <div className="relative -mt-10 ml-6 mr-10 bg-ink px-6 py-5 text-white md:ml-8">
              <p className="font-serif text-[1.75rem] leading-none">{ATTORNEY.name}</p>
              <p className="eyebrow mt-2 text-bronze">{ATTORNEY.title} · San Diego</p>
            </div>
          </div>
        </div>

        {/* Biography */}
        <div className="lg:col-span-7 lg:pt-4">
          <Eyebrow>Meet the Attorney</Eyebrow>
          <Reveal>
            <h2 className="display-lg mt-6 text-ink">{ATTORNEY.name}</h2>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="mt-3 font-serif text-[1.5rem] italic text-copper-deep">{ATTORNEY.title}</p>
          </Reveal>

          <div className="mt-8 space-y-5 text-[1.0625rem] leading-relaxed text-ink/75">
            {ATTORNEY.bio.map((p, i) => (
              <Reveal key={i} delay={0.1 + i * 0.05}>
                <p>{p}</p>
              </Reveal>
            ))}
          </div>

          <div className="mt-12">
            <Reveal>
              <h3 className="eyebrow text-ink/60">Professional Memberships</h3>
            </Reveal>
            <motion.ul
              className="mt-5 grid border-t border-ink/15 sm:grid-cols-2"
              variants={stagger(0.08)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              {ATTORNEY.memberships.map((m) => (
                <motion.li
                  key={m}
                  variants={rise}
                  className="flex items-center gap-4 border-b border-ink/15 py-5 sm:odd:pr-6 sm:even:border-l sm:even:pl-6"
                >
                  <Award className="size-5 shrink-0 text-copper" aria-hidden="true" />
                  <span className="font-medium text-ink">{m}</span>
                </motion.li>
              ))}
            </motion.ul>
          </div>

          <Reveal className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Button href={FIRM.bookUrl}>Book a Consultation</Button>
            <Button href={FIRM.social.linkedin} variant="outline" tone="light" icon={false}>
              <span className="inline-flex items-center gap-2">
                <LinkedinIcon className="size-4" /> Connect on LinkedIn
              </span>
            </Button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
