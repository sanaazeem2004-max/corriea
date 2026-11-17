import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Cookie } from 'lucide-react';
import { FIRM } from '../data/content';
import { EASE } from './ui';

const KEY = 'clf-cookie-consent';
const EVENT = 'clf:open-cookie-settings';

export const openCookieSettings = () => window.dispatchEvent(new Event(EVENT));

function read() {
  try { return JSON.parse(localStorage.getItem(KEY)); } catch { return null; }
}
function write(value) {
  try { localStorage.setItem(KEY, JSON.stringify({ ...value, at: Date.now() })); } catch { /* storage unavailable */ }
}

const CATEGORIES = [
  { key: 'necessary', label: 'Strictly necessary', desc: 'Required for the site to work. Always on.', locked: true },
  { key: 'analytics', label: 'Analytics', desc: 'Helps us understand how visitors use the site.' },
  { key: 'marketing', label: 'Marketing', desc: 'Used to deliver content tailored to your interests.' },
];

export default function CookieConsent() {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState(false);
  const [prefs, setPrefs] = useState({ necessary: true, analytics: false, marketing: false });

  useEffect(() => {
    const saved = read();
    if (saved) setPrefs((p) => ({ ...p, ...saved }));
    else {
      const t = setTimeout(() => setOpen(true), 1800); // after the hero has landed
      return () => clearTimeout(t);
    }
  }, []);

  useEffect(() => {
    const show = () => { setOpen(true); setSettings(true); };
    window.addEventListener(EVENT, show);
    return () => window.removeEventListener(EVENT, show);
  }, []);

  const save = (value) => { write(value); setPrefs(value); setOpen(false); setSettings(false); };

  const btn = 'min-h-11 flex-1 px-4 text-[0.75rem] font-semibold uppercase tracking-[0.14em] transition-colors';

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-labelledby="cookie-title"
          aria-describedby="cookie-desc"
          className="fixed bottom-4 left-4 right-4 z-[70] bg-paper p-6 text-ink shadow-[0_30px_60px_-20px_rgba(0,0,0,0.5)] sm:right-auto sm:max-w-[400px] md:bottom-6 md:left-6"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[3px] bg-copper" />
          <div className="flex items-center gap-3">
            <Cookie className="size-5 text-copper" aria-hidden="true" />
            <h2 id="cookie-title" className="font-serif text-[1.5rem] font-semibold leading-none">We Use Cookies</h2>
          </div>
          <p id="cookie-desc" className="mt-3 text-sm leading-relaxed text-ink/70">
            We use cookies to provide you with a better browsing experience and deliver content tailored
            to your interest. See our{' '}
            <a href={FIRM.privacyUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-copper-deep underline underline-offset-2">
              Privacy Policy
            </a>.
          </p>

          <AnimatePresence initial={false}>
            {settings && (
              <motion.ul
                className="overflow-hidden"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.5, ease: EASE }}
              >
                {CATEGORIES.map((c) => (
                  <li key={c.key} className="mt-4 flex items-start justify-between gap-4 border-t border-ink/10 pt-4">
                    <label htmlFor={`ck-${c.key}`} className="text-sm">
                      <span className="block font-semibold">{c.label}</span>
                      <span className="text-ink/60">{c.desc}</span>
                    </label>
                    <input
                      id={`ck-${c.key}`}
                      type="checkbox"
                      role="switch"
                      disabled={c.locked}
                      checked={prefs[c.key]}
                      onChange={(e) => setPrefs((p) => ({ ...p, [c.key]: e.target.checked }))}
                      className="mt-1 size-5 shrink-0 accent-copper disabled:opacity-60"
                    />
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>

          <div className="mt-5 flex gap-2">
            <button type="button" className={`${btn} bg-ink text-white hover:bg-copper`}
              onClick={() => save({ necessary: true, analytics: true, marketing: true })}>
              Accept
            </button>
            {settings ? (
              <button type="button" className={`${btn} border border-ink/20 hover:border-ink`} onClick={() => save(prefs)}>
                Save
              </button>
            ) : (
              <button type="button" className={`${btn} border border-ink/20 hover:border-ink`} aria-expanded={settings}
                onClick={() => setSettings(true)}>
                Settings
              </button>
            )}
            <button type="button" className={`${btn} border border-ink/20 hover:border-ink`}
              onClick={() => save({ necessary: true, analytics: false, marketing: false })}>
              Reject
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
