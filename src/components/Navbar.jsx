import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import { Menu, X, Phone, LogIn } from 'lucide-react';
import { FIRM, NAV } from '../data/content';
import { Button, EASE, Wordmark } from './ui';

function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id));
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids]);
  return active;
}

const ids = NAV.map((n) => n.id);

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const active = useActiveSection(ids);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock page scroll + close on Escape while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: EASE, delay: 0.2 }}
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-500 ${
          scrolled || open ? 'bg-ink/90 shadow-[0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-md' : 'bg-transparent'
        }`}
      >
        <nav
          aria-label="Primary"
          className={`container-x flex items-center justify-between gap-6 transition-[height] duration-500 ${
            scrolled ? 'h-[72px]' : 'h-[88px]'
          }`}
        >
          <a href="#home" aria-label="Correia Law Firm — home" onClick={() => setOpen(false)}>
            <Wordmark />
          </a>

          <ul className="hidden items-center gap-9 lg:flex">
            {NAV.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  aria-current={active === item.id ? 'true' : undefined}
                  className={`group relative py-2 text-[0.8125rem] font-semibold uppercase tracking-[0.14em] transition-colors duration-300 ${
                    active === item.id ? 'text-white' : 'text-white/65 hover:text-white'
                  }`}
                >
                  {item.label}
                  {/* hover underline */}
                  <span className="absolute -bottom-0.5 left-0 h-px w-full origin-right scale-x-0 bg-white/40 transition-transform duration-500 group-hover:origin-left group-hover:scale-x-100" />
                  {/* active underline glides between items */}
                  {active === item.id && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute -bottom-0.5 left-0 h-px w-full bg-bronze"
                      transition={{ type: 'spring', stiffness: 380, damping: 34 }}
                    />
                  )}
                </a>
              </li>
            ))}
          </ul>

          <div className="hidden items-center gap-6 lg:flex">
            <a
              href={FIRM.clientLoginUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-white/65 transition-colors hover:text-white"
            >
              <LogIn className="size-4" aria-hidden="true" /> Client Login
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
            <Button href={FIRM.bookUrl} icon={false} className="min-h-11 px-6">
              Book a Consultation
            </Button>
          </div>

          <button
            type="button"
            className="grid size-12 place-items-center text-white lg:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </nav>

        {/* Reading progress */}
        <motion.div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-px origin-left bg-gradient-to-r from-copper to-bronze"
          style={{ scaleX: progress, opacity: scrolled ? 1 : 0 }}
        />
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-40 flex flex-col bg-ink pt-[88px] lg:hidden"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <motion.ul
              className="container-x mt-8 flex flex-col"
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.06, delayChildren: 0.25 } } }}
            >
              {NAV.map((item, i) => (
                <motion.li
                  key={item.id}
                  variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } } }}
                  className="border-b border-white/10"
                >
                  <a
                    href={`#${item.id}`}
                    onClick={() => setOpen(false)}
                    className="flex items-baseline gap-5 py-5 font-serif text-[2rem] leading-none text-white"
                  >
                    <span className="font-sans text-xs font-semibold tracking-[0.2em] text-bronze">0{i + 1}</span>
                    {item.label}
                  </a>
                </motion.li>
              ))}
            </motion.ul>
            <motion.div
              className="container-x mt-auto flex flex-col gap-4 pb-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.6 } }}
            >
              <Button href={FIRM.bookUrl} className="w-full">
                Book a Consultation
              </Button>
              <div className="flex items-center justify-between text-sm text-white/70">
                <a href={FIRM.phoneHref} className="inline-flex min-h-11 items-center gap-2">
                  <Phone className="size-4 text-bronze" aria-hidden="true" /> {FIRM.phone}
                </a>
                <a href={FIRM.clientLoginUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2">
                  <LogIn className="size-4 text-bronze" aria-hidden="true" /> Client Login
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
