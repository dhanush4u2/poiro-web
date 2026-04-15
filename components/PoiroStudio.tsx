'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './PoiroStudio.module.css';

gsap.registerPlugin(ScrollTrigger);

export default function PoiroStudio() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const section = sectionRef.current;
    const heading = headingRef.current;
    if (!section || !heading) return;

    /* Animate heading with character reveal */
    gsap.from(heading, {
      y: 60,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 70%',
        toggleActions: 'play none none none',
      },
    });

    /* Parallax glow background */
    const glow = section.querySelector(`.${styles.glow}`);
    if (glow) {
      gsap.to(glow, {
        scale: 1.2,
        opacity: 0.6,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === section) st.kill();
      });
    };
  }, []);

  return (
    <section ref={sectionRef} className={`section ${styles.section}`} id="poiro-studio">
      <div className={styles.glow} aria-hidden="true" />
      <div className={`container ${styles.inner}`}>
        <span className="text-label">Poiro Studio</span>
        <h2 ref={headingRef} className={styles.heading}>
          Here&apos;s What Happens<br />
          <span className={styles.headingAccent}>to your Brief.</span>
        </h2>
        <div className={styles.visualGrid}>
          <div className={styles.visualCard}>
            <div className={styles.visualIcon}>📄</div>
            <span className={styles.visualLabel}>Your Brief Goes In</span>
          </div>
          <div className={styles.visualArrow}>→</div>
          <div className={styles.visualCard}>
            <div className={styles.visualIcon}>⚡</div>
            <span className={styles.visualLabel}>Poiro Processes</span>
          </div>
          <div className={styles.visualArrow}>→</div>
          <div className={`${styles.visualCard} ${styles.visualCardAccent}`}>
            <div className={styles.visualIcon}>🎬</div>
            <span className={styles.visualLabel}>Content Ships</span>
          </div>
        </div>
      </div>
    </section>
  );
}
