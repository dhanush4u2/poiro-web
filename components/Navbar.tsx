'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Navbar.module.css';

gsap.registerPlugin(ScrollTrigger);

export default function Navbar() {
  const navBarRef = useRef<HTMLDivElement>(null);

  /* ── Horizontal shrink as user scrolls (width-only, never hides) ── */
  useEffect(() => {
    const bar = navBarRef.current;
    if (!bar) return;

    const calc = () => {
      const vw = window.innerWidth;
      return {
        startW: Math.min(vw * 0.90, 1360),
        endW:   Math.min(vw * 0.58, 860),
      };
    };

    const st = ScrollTrigger.create({
      start: window.innerHeight * 0.5,
      end: window.innerHeight * 1.15,
      scrub: 1.4,
      onUpdate: (self) => {
        const { startW, endW } = calc();
        gsap.set(bar, { width: startW - self.progress * (startW - endW) });
      },
    });

    /* Keep initial width synced before first scroll event */
    const { startW } = calc();
    gsap.set(bar, { width: startW });

    /* Recalc on resize */
    const onResize = () => {
      const { startW } = calc();
      gsap.set(bar, { width: startW });
      st.refresh();
    };
    window.addEventListener('resize', onResize);

    return () => {
      st.kill();
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <nav className={styles.navWrapper} id="navbar">
      <div ref={navBarRef} className={styles.navBar}>
        <div className={styles.inner}>

          <a href="#" className={styles.logo} aria-label="Poiro Home">
            <Image
              src="/assets/logo.png"
              alt="Poiro"
              width={88}
              height={28}
              priority
              className={styles.logoImg}
            />
          </a>

          <div className={styles.links}>
            <a href="#storytelling" className={styles.link}>Services</a>
            <a href="#gallery"      className={styles.link}>Featured Work</a>
            <a href="#send-idea"   className={styles.link}>Reviews</a>
          </div>

          <a href="#send-idea" className={styles.cta} id="nav-cta">
            Get in Touch
          </a>

        </div>
      </div>
    </nav>
  );
}
