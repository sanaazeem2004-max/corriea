import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, CalendarCheck, CheckCircle2, FileText, Mail, MapPin, Phone, Send } from 'lucide-react';
import officeImg from '../assets/office.jpg';
import { FIRM, PRACTICE_AREAS } from '../data/content';
import { Button, EASE, Eyebrow, Reveal, rise, stagger } from './ui';

const CHANNELS = [
  { icon: Phone, label: 'Call us', value: FIRM.phone, href: FIRM.phoneHref },
  { icon: Mail, label: 'Email', value: FIRM.email, href: FIRM.emailHref },
  { icon: MapPin, label: 'Visit', value: `${FIRM.street}, ${FIRM.city}`, href: FIRM.directions, cta: 'Get directions' },
  { icon: FileText, label: 'Potential new client', value: 'Fill out the intake form', href: FIRM.intakeUrl },
];

const initial = { name: '', email: '', phone: '', area: '', message: '', consent: false };

function Field({ id, label, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-ink/60">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-2 text-sm text-[#a33a1f]">
          {error}
        </p>
      )}
    </div>
  );
}

const inputCls =
  'w-full border-0 border-b border-ink/20 bg-transparent px-0 py-3 text-base text-ink placeholder:text-ink/35 transition-colors focus:border-copper focus:outline-none focus:ring-0';

function ContactForm() {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  const set = (k) => (e) => setValues((v) => ({ ...v, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const validate = () => {
    const e = {};
    if (!values.name.trim()) e.name = 'Please enter your name.';
    if (!/^\S+@\S+\.\S+$/.test(values.email)) e.email = 'Please enter a valid email address.';
    if (!values.message.trim()) e.message = 'Please add a short, general description.';
    if (!values.consent) e.consent = 'Please confirm you have read the notice above.';
    return e;
  };

  const onSubmit = (ev) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) {
      document.getElementById(Object.keys(e)[0])?.focus();
      return;
    }
    // No server is attached to this site, so the enquiry is handed to the visitor's email app,
    // addressed to the firm's published inbox.
    const subject = `Website enquiry${values.area ? ` — ${values.area}` : ''}`;
    const details = [
      `Name: ${values.name}`,
      `Email: ${values.email}`,
      values.phone ? `Phone: ${values.phone}` : null,
      values.area ? `Practice area: ${values.area}` : null,
    ].filter(Boolean);
    const body = `${details.join('\n')}\n\n${values.message}`;
    window.location.href = `${FIRM.emailHref}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  return (
    <div className="relative flex h-full flex-col bg-paper p-7 text-ink shadow-[0_40px_80px_-40px_rgba(0,0,0,0.6)] md:p-10">
      <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[3px] bg-copper" />
      <AnimatePresence mode="wait" initial={false}>
        {sent ? (
          <motion.div
            key="sent"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="flex min-h-[520px] flex-col items-start justify-center"
            role="status"
          >
            <CheckCircle2 className="size-10 text-copper" aria-hidden="true" />
            <h3 className="display-md mt-6">Your message is ready to send.</h3>
            <p className="mt-4 max-w-[42ch] leading-relaxed text-ink/70">
              We opened your email app with the enquiry addressed to {FIRM.email}. If nothing opened,
              email us directly or call {FIRM.phone}.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href={FIRM.bookUrl}>Book a Consultation</Button>
              <button
                type="button"
                onClick={() => { setValues(initial); setSent(false); }}
                className="min-h-12 px-4 text-[0.8125rem] font-semibold uppercase tracking-[0.16em] text-ink/60 hover:text-ink"
              >
                New message
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            noValidate
            onSubmit={onSubmit}
            className="flex flex-1 flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -10 }}
            aria-labelledby="form-title"
          >
            <h3 id="form-title" className="display-md">Send us a message</h3>
            <p className="mt-3 text-sm leading-relaxed text-ink/65">
              Please include only the names of the parties and general information about the issue.
              Do not send confidential details until an attorney has asked you to.
            </p>

            <div className="mt-8 grid flex-1 gap-7 sm:grid-cols-2 sm:grid-rows-[auto_auto_1fr]">
              <Field id="name" label="Full name" error={errors.name}>
                <input id="name" autoComplete="name" className={inputCls} value={values.name} onChange={set('name')}
                  aria-invalid={!!errors.name} aria-describedby={errors.name ? 'name-error' : undefined} />
              </Field>
              <Field id="email" label="Email" error={errors.email}>
                <input id="email" type="email" autoComplete="email" className={inputCls} value={values.email} onChange={set('email')}
                  aria-invalid={!!errors.email} aria-describedby={errors.email ? 'email-error' : undefined} />
              </Field>
              <Field id="phone" label="Phone (optional)">
                <input id="phone" type="tel" autoComplete="tel" className={inputCls} value={values.phone} onChange={set('phone')} />
              </Field>
              <Field id="area" label="Practice area">
                <select id="area" className={`${inputCls} cursor-pointer`} value={values.area} onChange={set('area')}>
                  <option value="">Not sure yet</option>
                  {PRACTICE_AREAS.map((a) => (
                    <option key={a.slug} value={a.title}>{a.title}</option>
                  ))}
                </select>
              </Field>
              <div className="flex flex-col sm:col-span-2 [&>div]:flex [&>div]:flex-1 [&>div]:flex-col">
                <Field id="message" label="How can we help?" error={errors.message}>
                  <textarea id="message" rows={4} className={`${inputCls} min-h-28 flex-1 resize-none`} value={values.message} onChange={set('message')}
                    placeholder="e.g. Interested in starting a corporation"
                    aria-invalid={!!errors.message} aria-describedby={errors.message ? 'message-error' : undefined} />
                </Field>
              </div>
            </div>

            <div className="mt-7">
              <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-ink/70">
                <input
                  id="consent"
                  type="checkbox"
                  checked={values.consent}
                  onChange={set('consent')}
                  className="mt-1 size-4 shrink-0 accent-copper"
                  aria-invalid={!!errors.consent}
                  aria-describedby={errors.consent ? 'consent-error' : undefined}
                />
                I understand that contacting the firm does not create an attorney-client relationship.
              </label>
              {errors.consent && (
                <p id="consent-error" role="alert" className="mt-2 text-sm text-[#a33a1f]">{errors.consent}</p>
              )}
            </div>

            <button
              type="submit"
              className="group relative mt-8 inline-flex min-h-12 w-full self-start items-center justify-center gap-3 overflow-hidden bg-ink px-7 text-[0.8125rem] font-semibold uppercase tracking-[0.16em] text-white transition-colors duration-500 hover:text-ink sm:w-auto"
            >
              <span aria-hidden="true" className="absolute inset-0 origin-left scale-x-0 bg-bronze transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-x-100" />
              <span className="relative">Send message</span>
              <Send className="relative size-4 transition-transform duration-500 group-hover:translate-x-1" aria-hidden="true" />
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Contact() {
  return (
    <section id="contact" className="grain relative overflow-hidden bg-ink text-white">
      {/* Ghosted office photograph */}
      <img src={officeImg} alt="" aria-hidden="true" loading="lazy"
        className="absolute inset-0 -z-10 h-full w-full object-cover opacity-[0.12]" />
      <div className="section-y container-x grid gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <Eyebrow tone="dark">Contact &amp; Consultation</Eyebrow>
          <Reveal>
            <h2 className="display-lg mt-6">
              Let’s Find the Right Path <em className="text-bronze">Forward.</em>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-[44ch] text-[1.0625rem] leading-relaxed text-white/70">
              We are ready to help you. Book a consultation online, call the office, or send a short
              message and we will be in touch.
            </p>
          </Reveal>

          <Reveal delay={0.15} className="mt-10">
            <a
              href={FIRM.bookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between gap-6 border border-bronze/50 bg-bronze/10 p-6 transition-colors duration-500 hover:bg-bronze hover:text-ink"
            >
              <span className="flex items-center gap-4">
                <CalendarCheck className="size-6 text-bronze transition-colors group-hover:text-ink" aria-hidden="true" />
                <span>
                  <span className="block font-serif text-[1.625rem] leading-tight">Book a Consultation</span>
                  <span className="mt-1 block text-sm text-white/60 transition-colors group-hover:text-ink/70">
                    Choose a time that suits you
                  </span>
                </span>
              </span>
              <ArrowUpRight className="size-6 shrink-0 transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1" aria-hidden="true" />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </Reveal>

          <motion.ul
            className="mt-4 divide-y divide-white/10 border-y border-white/10"
            variants={stagger(0.08)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {CHANNELS.map(({ icon: Icon, label, value, href }) => (
              <motion.li key={label} variants={rise}>
                <a
                  href={href}
                  {...(/^https?:/.test(href) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="group flex items-center gap-5 py-5"
                >
                  <Icon className="size-5 shrink-0 text-bronze" aria-hidden="true" />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-white/50">{label}</span>
                    <span className="mt-1 block break-words text-[1rem] text-white transition-colors group-hover:text-bronze">{value}</span>
                  </span>
                  <ArrowUpRight className="size-4 shrink-0 text-white/40 transition-all duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-bronze" aria-hidden="true" />
                </a>
              </motion.li>
            ))}
          </motion.ul>
        </div>

        <Reveal delay={0.15} className="lg:col-span-7 lg:self-stretch">
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}
