'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import styles from './AboutSection.module.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-inter',
});

const LINES = [
  'We craft brand identities, narratives, and digital',
  'experiences that keep up with your ambition.',
  'So you can focus on building what matters,',
  'while we shape how the world sees it.',
];

interface CharItem { char: string; br: boolean }

function buildChars(lines: string[]): CharItem[] {
  const chars: CharItem[] = [];
  lines.forEach((line, li) => {
    for (let i = 0; i < line.length; i++) {
      chars.push({ char: line[i], br: i === 0 && li > 0 });
    }
  });
  return chars;
}

const LOGOS = [
  { name: 'Schbang.',             hash: true  },
  { name: 'ISKCON',               caps: true  },
  { name: 'the moms co.',         italic: true },
  { name: 'unicef',               reg: true   },
  { name: 'BURGER BAE',           wide: true  },
  { name: 'Flipkart Commerce Cloud', small: true },
];

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [prog, setProg]   = useState(0);
  const chars = useMemo(() => buildChars(LINES), []);
  const total = chars.length;

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      // Start counting when the section top enters the viewport (rect.top = innerHeight).
      // At rect.top = 0 (section fully filling frame) prog = innerHeight / offsetHeight = 0.25
      // so the text is already 25% revealed by the time the section covers the screen.
      setProg(Math.max(0, Math.min(1, (window.innerHeight - rect.top) / el.offsetHeight)));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const textProg = Math.min(1, prog / 0.85);
  const charOp   = (i: number) => {
    const s = i / total;
    return lerp(0.15, 1.0, Math.max(0, Math.min(1, (textProg - s) / (3 / total))));
  };

  return (
    <section
      ref={sectionRef}
      className={`${cormorant.variable} ${inter.variable} ${styles.section}`}
    >
      <div className={styles.sticky}>

        {/* ── Animated paragraph ── */}
        <div className={styles.textWrap}>
          {chars.map((c, i) => (
            <span key={i}>
              {c.br && <br />}
              <span style={{ color: `rgba(240,234,222,${charOp(i).toFixed(3)})` }}>
                {c.char === ' ' ? '\u00A0' : c.char}
              </span>
            </span>
          ))}
        </div>

        {/* ── Logo band ── */}
        <div className={styles.logoBand}>

          {/* Badge */}
          <div className={styles.badge}>
            <svg width="32" height="54" viewBox="0 0 20 34" fill="none" aria-hidden="true" className={styles.bracketSvg}>
              <path d="M16 2C12 6 9 11 9 17S12 28 16 32" stroke="#fff" strokeWidth="1" fill="none"/>
              <path d="M13 4C10 8 7 12 7 17S10 26 13 30" stroke="#fff" strokeWidth="0.8" fill="none"/>
              <path d="M10 7C8 10 6 13 6 17S8 24 10 27" stroke="#fff" strokeWidth="0.6" fill="none"/>
            </svg>
            <div className={styles.badgeText}>
              <span className={styles.badgeCount}>Trusted by 60+</span>
              <span className={styles.badgeLabel}>Organizations</span>
            </div>
            <svg width="32" height="54" viewBox="0 0 20 34" fill="none" aria-hidden="true" className={`${styles.bracketSvg} ${styles.bracketFlip}`}>
              <path d="M16 2C12 6 9 11 9 17S12 28 16 32" stroke="#fff" strokeWidth="1" fill="none"/>
              <path d="M13 4C10 8 7 12 7 17S10 26 13 30" stroke="#fff" strokeWidth="0.8" fill="none"/>
              <path d="M10 7C8 10 6 13 6 17S8 24 10 27" stroke="#fff" strokeWidth="0.6" fill="none"/>
            </svg>
          </div>

          {/* Scrolling logos */}
          <div className={styles.logoScroll}>
            <div className={styles.mqTrack}>
              {Array.from({ length: 8 }, () => LOGOS).flat().map((l, i) => (
                <span
                  key={i}
                  className={styles.logoItem}
                  style={{
                    fontFamily: l.italic || l.hash
                      ? 'var(--font-cormorant), serif'
                      : 'var(--font-inter), sans-serif',
                    fontSize:   l.wide || l.caps ? 24 : l.small ? 20 : 32,
                    fontWeight: l.wide ? 800 : l.caps ? 700 : l.hash ? 600 : 400,
                    fontStyle:  l.italic ? 'italic' : 'normal',
                    letterSpacing: l.wide ? '3px' : l.caps ? '2px' : '0.3px',
                  }}
                >
                  {l.hash && <span className={styles.hashPrefix}>#</span>}
                  {l.name}
                  {l.reg  && <sup className={styles.regMark}>®</sup>}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
