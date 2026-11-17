import { motion } from 'framer-motion';
import { ArrowUp, LogIn, Mail, MapPin, Phone, Rss } from 'lucide-react';
import logo from '../assets/cf-logo.png';
import { DISCLAIMER, FIRM, NAV, PRACTICE_AREAS } from '../data/content';
import { Button, DrawLine, InstagramIcon, LinkedinIcon } from './ui';
import { openCookieSettings } from './CookieConsent';

const ext = { target: '_blank', rel: 'noopener noreferrer' };

function Col({ title, children }) {
  return (
    <div>
      <h2 className="eyebrow text-bronze">{title}</h2>
      <ul className="mt-6 space-y-2 text-[0.9375rem] text-white/70">{children}</ul>
    </div>
  );
}

const linkCls = 'inline-flex min-h-7 items-center gap-2 py-0.5 transition-colors hover:text-white';

export default function Footer() {
  return (
    <footer className="bg-[#0b0f10] text-white">
      {/* CTA band */}
      <div className="container-x flex flex-col items-start justify-between gap-8 border-b border-white/10 py-14 md:flex-row md:items-center">
        <p className="display-md max-w-[22ch] font-medium text-white">
          Ready when you are. <em className="text-bronze">Let’s talk about your matter.</em>
        </p>
        <Button href={FIRM.bookUrl}>Book a Consultation</Button>
      </div>

      <div className="container-x grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-12 lg:gap-10">
        <div className="sm:col-span-2 lg:col-span-4">
          <img src={logo} alt="Correia Law Firm" width="70" height="109" loading="lazy" className="h-[109px] w-[70px]" />
          <p className="mt-6 max-w-[34ch] text-[0.9375rem] leading-relaxed text-white/60">
            Legal Expertise. Business Instinct. Committed Counsel. Serving San Diego, California.
          </p>
          <div className="mt-6 flex gap-3">
            {[
              { href: FIRM.social.linkedin, label: 'LinkedIn', Icon: LinkedinIcon },
              { href: FIRM.social.instagram, label: 'Instagram', Icon: InstagramIcon },
              { href: FIRM.social.blog, label: 'Enlightened Equire blog', Icon: Rss },
            ].map(({ href, label, Icon }) => (
              <a key={label} href={href} {...ext} aria-label={`${label} (opens in a new tab)`}
                className="grid size-11 place-items-center border border-white/15 text-white/70 transition-colors hover:border-bronze hover:bg-bronze hover:text-ink">
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2">
          <Col title="Navigate">
            {NAV.map((n) => (
              <li key={n.id}><a href={`#${n.id}`} className={linkCls}>{n.label}</a></li>
            ))}
            <li><a href={FIRM.clientLoginUrl} {...ext} className={linkCls}><LogIn className="size-4" aria-hidden="true" />Client Login</a></li>
          </Col>
        </div>

        <div className="lg:col-span-3">
          <Col title="Practice Areas">
            {PRACTICE_AREAS.map((a) => (
              <li key={a.slug}><a href="#practice-areas" className={linkCls}>{a.title}</a></li>
            ))}
          </Col>
        </div>

        <div className="lg:col-span-3">
          <Col title="Contact">
            <li><a href={FIRM.phoneHref} className={linkCls}><Phone className="size-4 text-bronze" aria-hidden="true" />{FIRM.phone}</a></li>
            <li><a href={FIRM.emailHref} className={linkCls}><Mail className="size-4 text-bronze" aria-hidden="true" />{FIRM.email}</a></li>
            <li>
              <a href={FIRM.directions} {...ext} className={`${linkCls} items-start`}>
                <MapPin className="mt-1 size-4 shrink-0 text-bronze" aria-hidden="true" />
                <span>{FIRM.street}<br />{FIRM.city}</span>
              </a>
            </li>
            <li><a href={FIRM.intakeUrl} {...ext} className={linkCls}>Potential new client form</a></li>
          </Col>
        </div>
      </div>

      {/* Disclaimer — preserved verbatim from the original site */}
      <div className="container-x border-t border-white/10 py-12">
        <div className="flex items-center gap-4">
          <h2 className="eyebrow text-white/50">Disclaimer</h2>
          <DrawLine className="flex-1 bg-white/10" />
        </div>
        <div className="mt-6 grid gap-6 text-[0.8125rem] leading-relaxed text-white/45 lg:grid-cols-3 lg:gap-10">
          {DISCLAIMER.map((d) => (
            <p key={d.title}>
              <strong className="font-semibold text-white/70">{d.title}:</strong> {d.text}
            </p>
          ))}
        </div>
      </div>

      <div className="container-x flex flex-col gap-4 border-t border-white/10 py-7 text-[0.8125rem] text-white/50 md:flex-row md:items-center md:justify-between">
        <p>©{new Date().getFullYear()} Correia Law Firm. All rights reserved.</p>
        <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <li><a href={FIRM.privacyUrl} {...ext} className="inline-flex min-h-7 items-center hover:text-white">Privacy Policy</a></li>
          <li><a href={FIRM.termsUrl} {...ext} className="inline-flex min-h-7 items-center hover:text-white">Terms and Conditions</a></li>
          <li><button type="button" onClick={openCookieSettings} className="min-h-7 hover:text-white">Cookie Settings</button></li>
          <li>
            <motion.a href="#home" whileHover={{ y: -3 }} className="inline-flex min-h-7 items-center gap-2 hover:text-white">
              Back to top <ArrowUp className="size-4" aria-hidden="true" />
            </motion.a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
