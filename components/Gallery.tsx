'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Gallery.module.css';

gsap.registerPlugin(ScrollTrigger);

const tabs = ['Short Form', 'Statics', 'UGC / Affiliate', 'TVC / Animatics'];

const galleryGradients = [
  'linear-gradient(135deg, #1a0a2e, #2d1b4e)',
  'linear-gradient(135deg, #0a1e2e, #1b3a4e)',
  'linear-gradient(135deg, #2e0a0a, #4e1b1b)',
  'linear-gradient(135deg, #0a2e1a, #1b4e2d)',
  'linear-gradient(135deg, #2e2a0a, #4e451b)',
  'linear-gradient(135deg, #1a0a2e, #3d1b5e)',
  'linear-gradient(135deg, #2e1a0a, #4e2d1b)',
  'linear-gradient(135deg, #0a0a2e, #1b1b4e)',
];

export default function Gallery() {
  const [activeTab, setActiveTab] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const section = sectionRef.current;
    if (!section) return;

    const heading = section.querySelector(`.${styles.heading}`);
    if (heading) {
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
    }

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === section) st.kill();
      });
    };
  }, []);

  /* Animate grid items when tab changes */
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const items = grid.querySelectorAll(`.${styles.gridItem}`);
    gsap.from(items, {
      y: 40,
      opacity: 0,
      scale: 0.95,
      duration: 0.6,
      stagger: 0.06,
      ease: 'power3.out',
    });
  }, [activeTab]);

  return (
    <section ref={sectionRef} className={`section ${styles.section}`} id="gallery">
      <div className={`container ${styles.inner}`}>
        <span className="text-label">Gallery</span>
        <h2 className={styles.heading}>Our Work</h2>

        <div className={styles.tabs} role="tablist">
          {tabs.map((tab, i) => (
            <button
              key={tab}
              role="tab"
              aria-selected={activeTab === i}
              className={`${styles.tab} ${activeTab === i ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(i)}
              id={`gallery-tab-${i}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div ref={gridRef} className={styles.grid}>
          {galleryGradients.map((gradient, i) => (
            <div
              key={`${activeTab}-${i}`}
              className={styles.gridItem}
              style={{
                background: gradient,
                gridRow: i === 0 || i === 3 ? 'span 2' : 'span 1',
              }}
            >
              <div className={styles.gridOverlay}>
                <div className={styles.playBtn}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <span className={styles.gridLabel}>
                  {tabs[activeTab]} Preview
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
