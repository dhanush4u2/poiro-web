'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './SystemArchitecture.module.css';

gsap.registerPlugin(ScrollTrigger);

const cards = [
  {
    num: '01',
    label: 'Curate Context',
    title: 'Brand Cosmos',
    desc: 'Tap into a living universe of trends and audience signals to create content your consumers can\'t scroll past. Tracking the best brands and creators in your category, Brand Cosmos parses thousands of hours of content to surface the most compelling ideas, storylines, visual concepts and hooks.',
    gradient: 'linear-gradient(135deg, #1a0a2e 0%, #16213e 50%, #0a1628 100%)',
  },
  {
    num: '02',
    label: 'Ideate & Communicate',
    title: 'Atlas',
    desc: 'Where great ideas become brilliant briefs, and creative teams finally work as one. Ideate with an intelligent briefing agent, curate references from across the web, generate samples and manage feedback, all in one place.',
    gradient: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 50%, #0a1628 100%)',
  },
  {
    num: '03',
    label: 'Create Limitlessly',
    title: 'Infinite Flow',
    desc: 'From six-second hooks to full-scale TVCs, unleash visual stories at a scale you never thought possible. Collaboratively build creative workflows, choose from 100+ AI models and proprietary pipelines, and take precise control over every step.',
    gradient: 'linear-gradient(135deg, #0a2e1a 0%, #1a4a2e 50%, #0a1e14 100%)',
  },
  {
    num: '04',
    label: 'Build Apps',
    title: 'App Studio',
    desc: 'Turn your creative workflows into powerful no-code apps, so your best ideas scale without limits. Convert even your most complex creative workflows into simple, intuitive apps and put the power of world-class content creation in everyone\'s hands.',
    gradient: 'linear-gradient(135deg, #2e1a0a 0%, #4a2e1a 50%, #1e140a 100%)',
  },
  {
    num: '05',
    label: 'Final Touch',
    title: 'Poiro Studio',
    desc: 'Polish every pixel, perfect every frame. AI-powered editing, entirely on your terms. Edit images and videos with a level of precision and finesse that was once the preserve of the most skilled editors.',
    gradient: 'linear-gradient(135deg, #2e0a1a 0%, #4a1a2e 50%, #1e0a14 100%)',
  },
];

export default function SystemArchitecture() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const section = sectionRef.current;
    const cardsEl = cardsRef.current;
    const scrollEl = scrollRef.current;
    if (!section || !cardsEl || !scrollEl) return;

    const cardItems = cardsEl.querySelectorAll(`.${styles.card}`);

    /* Staggered entrance */
    gsap.from(cardItems, {
      y: 80,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 60%',
        toggleActions: 'play none none none',
      },
    });

    /* Horizontal scroll on desktop */
    const mm = gsap.matchMedia();
    mm.add('(min-width: 1025px)', () => {
      const totalWidth = scrollEl.scrollWidth - window.innerWidth + 200;

      gsap.to(scrollEl, {
        x: -totalWidth,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${totalWidth}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      });
    });

    return () => {
      mm.revert();
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === section) st.kill();
      });
    };
  }, []);

  return (
    <section ref={sectionRef} className={styles.section} id="system-architecture">
      <div className={styles.header}>
        <span className="text-label">System Architecture</span>
        <h2 className={styles.heading}>
          An Operating System<br />for Storytelling.
        </h2>
      </div>

      <div ref={scrollRef} className={styles.scrollContainer}>
        <div ref={cardsRef} className={styles.cards}>
          {cards.map((card) => (
            <div key={card.num} className={styles.card}>
              <div className={styles.cardPreview} style={{ background: card.gradient }}>
                <span className={styles.cardPreviewLabel}>{card.title}</span>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.cardMeta}>
                  <span className={styles.cardNum}>{card.num}.</span>
                  <span className={styles.cardLabel}>{card.label}</span>
                </div>
                <h3 className={styles.cardTitle}>{card.title}</h3>
                <p className={styles.cardDesc}>{card.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
