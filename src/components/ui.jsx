import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export const EASE = [0.16, 1, 0.3, 1];

/** Fades + lifts children into view once, when scrolled into the viewport. */
export function Reveal({ children, delay = 0, y = 28, className = '', as = 'div' }) {
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      {children}
    </Tag>
  );
}

/** Stagger container + item, for lists and grids. */
export const stagger = (gap = 0.08, delayChildren = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren: gap, delayChildren } },
});
export const rise = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};

/** Decorative rule that draws itself from the left. */
export function DrawLine({ className = '', delay = 0, origin = 'left' }) {
  return (
    <motion.span
      aria-hidden="true"
      className={`block h-px ${className}`}
      style={{ transformOrigin: origin }}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.2, ease: EASE, delay }}
    />
  );
}

/** Small uppercase label with a drawn line in front of it. */
export function Eyebrow({ children, tone = 'light', className = '' }) {
  const color = tone === 'dark' ? 'text-bronze' : 'text-copper-deep';
  const line = tone === 'dark' ? 'bg-bronze' : 'bg-copper';
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <DrawLine className={`w-10 ${line}`} />
      <span className={`eyebrow ${color}`}>{children}</span>
    </div>
  );
}

/** Image that is unveiled by a sliding mask, then settles from a slight zoom. */
export function ImageReveal({ src, alt, className = '', imgClassName = '', delay = 0, eager = false }) {
  return (
    <motion.div
      className={`relative overflow-hidden ${className}`}
      initial={{ clipPath: 'inset(0 0 100% 0)' }}
      whileInView={{ clipPath: 'inset(0 0 0% 0)' }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 1.3, ease: EASE, delay }}
    >
      <motion.img
        src={src}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        className={`h-full w-full object-cover ${imgClassName}`}
        initial={{ scale: 1.18 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.8, ease: EASE, delay }}
      />
    </motion.div>
  );
}

/**
 * Button rendered as a link. Variants:
 *  - solid:   copper fill, light text
 *  - outline: hairline border, fills on hover
 *  - ghost:   text link with animated arrow
 */
export function Button({ href, children, variant = 'solid', tone = 'dark', icon = true, className = '', ...rest }) {
  const external = /^https?:/.test(href);
  const linkProps = external ? { target: '_blank', rel: 'noopener noreferrer' } : {};
  const base =
    'group relative inline-flex min-h-12 items-center justify-center gap-3 overflow-hidden whitespace-nowrap px-7 text-[0.8125rem] font-semibold uppercase tracking-[0.16em] transition-colors duration-500';

  const variants = {
    solid: 'bg-copper text-white hover:text-ink',
    outline:
      tone === 'dark'
        ? 'border border-white/35 text-white hover:border-bronze hover:text-ink'
        : 'border border-ink/25 text-ink hover:border-ink hover:text-white',
  };
  const fill = variant === 'solid' ? 'bg-bronze' : tone === 'dark' ? 'bg-bronze' : 'bg-ink';

  return (
    <a href={href} className={`${base} ${variants[variant]} ${className}`} {...linkProps} {...rest}>
      {/* Fill wipe on hover */}
      <span
        aria-hidden="true"
        className={`absolute inset-0 -z-0 origin-left scale-x-0 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-x-100 ${fill}`}
      />
      <span className="relative z-10">{children}</span>
      {icon && (
        <ArrowRight
          aria-hidden="true"
          className="relative z-10 size-4 transition-transform duration-500 group-hover:translate-x-1"
        />
      )}
      {external && <span className="sr-only"> (opens in a new tab)</span>}
    </a>
  );
}

/** Text link with growing underline and arrow. */
export function TextLink({ href, children, tone = 'light', className = '', onClick, as = 'a' }) {
  const color = tone === 'dark' ? 'text-bronze' : 'text-copper-deep';
  const Tag = as;
  const external = as === 'a' && /^https?:/.test(href || '');
  return (
    <Tag
      {...(as === 'a' ? { href } : { type: 'button' })}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      onClick={onClick}
      className={`group inline-flex min-h-11 cursor-pointer items-center gap-2 whitespace-nowrap text-[0.8125rem] font-bold uppercase tracking-[0.16em] ${color} ${className}`}
    >
      <span className="relative">
        {children}
        <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-500 group-hover:scale-x-100" />
      </span>
      <ArrowRight aria-hidden="true" className="size-4 transition-transform duration-500 group-hover:translate-x-1" />
    </Tag>
  );
}

/* Brand icons (not shipped by this Lucide version) */
export function LinkedinIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
    </svg>
  );
}
export function InstagramIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
    </svg>
  );
}

/** Typographic wordmark used in the header. */
export function Wordmark({ tone = 'dark' }) {
  const main = tone === 'dark' ? 'text-white' : 'text-ink';
  return (
    <span className="flex items-center gap-3">
      <span
        aria-hidden="true"
        className="grid size-10 place-items-center border border-bronze/70 font-serif text-xl italic text-bronze"
      >
        C
      </span>
      <span className="flex flex-col leading-none">
        <span className={`font-serif text-[1.375rem] font-semibold tracking-wide ${main}`}>Correia</span>
        <span className="mt-1 text-[0.625rem] font-semibold uppercase tracking-[0.34em] text-bronze">Law Firm</span>
      </span>
    </span>
  );
}
