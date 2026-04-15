'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './SendIdea.module.css';

gsap.registerPlugin(ScrollTrigger);

export default function SendIdea() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const section = sectionRef.current;
    if (!section) return;

    const elements = section.querySelectorAll(`.${styles.animateIn}`);
    gsap.from(elements, {
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 70%',
        toggleActions: 'play none none none',
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === section) st.kill();
      });
    };
  }, []);

  return (
    <section ref={sectionRef} className={`section ${styles.section}`} id="send-idea">
      <div className={`container ${styles.inner}`}>
        <p className={`${styles.eyebrow} animateIn`}>Unbelievable right?</p>
        <h2 className={`${styles.heading} ${styles.animateIn}`}>
          Send Us Your Idea &<br />
          We&apos;ll Bring It To Life.
        </h2>

        <div className={`${styles.previews} ${styles.animateIn}`}>
          {[1, 2, 3].map((n) => (
            <div key={n} className={styles.previewCard}>
              <div className={styles.previewInner}>
                <span className={styles.previewLabel}>Preview {n}</span>
              </div>
            </div>
          ))}
        </div>

        <div className={`${styles.uploadArea} ${styles.animateIn}`}>
          <div className={styles.uploadIcon}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>
          <h3 className={styles.uploadTitle}>Upload Brief</h3>
          <p className={styles.uploadDesc}>Click & Share your brief with us</p>
          <button className="btn-primary" id="upload-brief-btn">
            Upload Your Brief <span>↗</span>
          </button>
        </div>
      </div>
    </section>
  );
}
