'use client';

import { useEffect, useRef } from 'react';
import styles from './VideoScrub.module.css';

const SEQUENCES: Array<{ label: string; start: number; end: number }> = [
  { label: 'Brief Received',  start: 0,   end: 60  },
  { label: 'Direction Set',   start: 60,  end: 120 },
  { label: 'Creation',        start: 120, end: 180 },
  { label: 'Refinement',      start: 180, end: 240 },
  { label: 'Final Delivery',  start: 240, end: 300 },
];
const TOTAL_FRAMES       = 301;
const FRAME_BASE         = '/frames/frame_';

function framePath(n: number): string {
  return "" + FRAME_BASE + String(n).padStart(5, '0') + ".webp";
}

export default function VideoScrub() {
  const sectionRef    = useRef<HTMLElement>(null);
  const canvasRef     = useRef<HTMLCanvasElement>(null);
  const labelRef      = useRef<HTMLSpanElement>(null);
  const leftArrowRef  = useRef<HTMLButtonElement>(null);
  const rightArrowRef = useRef<HTMLButtonElement>(null);
  const dotsRef       = useRef<(HTMLButtonElement | null)[]>(
    Array(SEQUENCES.length).fill(null)
  );

  const stateRef = useRef({
    currentFrame: 0,
    targetFrame: 0,
    currentSeq: 0,
    rafId: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const images: (HTMLImageElement | null)[] = new Array(TOTAL_FRAMES).fill(null);
    const state = stateRef.current;

    function draw(n: number) {
      const img = images[n];
      if (!img) return;
      const w = img.naturalWidth  || 1920;
      const h = img.naturalHeight || 1080;
      if (canvas!.width !== w || canvas!.height !== h) {
        canvas!.width  = w;
        canvas!.height = h;
      }
      ctx!.drawImage(img, 0, 0);
    }

    function updateUI(frame: number) {
      let seqIdx = SEQUENCES.findIndex(s => frame >= s.start && frame <= s.end);
      if (seqIdx === -1) seqIdx = frame < SEQUENCES[0].start ? 0 : SEQUENCES.length - 1;
      
      if (state.currentSeq !== seqIdx) {
        state.currentSeq = seqIdx;
        dotsRef.current.forEach((dot, i) =>
          dot?.setAttribute('data-active', i === seqIdx ? 'true' : 'false')
        );
        if (labelRef.current) {
          labelRef.current.textContent = SEQUENCES[seqIdx]?.label ?? '';
        }
      }

      const isAtStart = frame === 0;
      const isAtEnd   = frame === TOTAL_FRAMES - 1;

      leftArrowRef.current?.setAttribute('data-disabled', isAtStart ? 'true' : 'false');
      rightArrowRef.current?.setAttribute('data-disabled', isAtEnd ? 'true' : 'false');
    }

    function loop() {
      if (Math.abs(state.targetFrame - state.currentFrame) > 0.1) {
        state.currentFrame += (state.targetFrame - state.currentFrame) * 0.1;
      } else {
        state.currentFrame = state.targetFrame;
      }

      const roundedFrame = Math.round(state.currentFrame);
      draw(roundedFrame);
      updateUI(roundedFrame);

      state.rafId = requestAnimationFrame(loop);
    }
    state.rafId = requestAnimationFrame(loop);

    function handleScroll() {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      if (scrollable <= 0) return;

      let progress = -rect.top / scrollable;
      progress = Math.max(0, Math.min(1, progress));
      
      state.targetFrame = progress * (TOTAL_FRAMES - 1);
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    function loadImage(n: number): Promise<void> {
      return new Promise((resolve) => {
        if (images[n]) { resolve(); return; }
        const img = new Image();
        img.onload  = () => { images[n] = img; resolve(); };
        img.onerror = () => resolve();
        img.src = framePath(n);
      });
    }

    const firstSeq = SEQUENCES[0];
    const eager: Promise<void>[] = [];
    for (let i = firstSeq.start; i <= firstSeq.end; i++) eager.push(loadImage(i));
    Promise.all(eager).then(() => {
      handleScroll();
      for (let i = firstSeq.end + 1; i < TOTAL_FRAMES; i++) loadImage(i);
    });

    return () => {
      cancelAnimationFrame(state.rafId);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  function goToSequence(seqIdx: number) {
    if (!sectionRef.current) return;
    const seq = SEQUENCES[seqIdx];
    if (!seq) return;
    
    let frameProgress = seq.start / (TOTAL_FRAMES - 1);
    if (seqIdx === SEQUENCES.length - 1) {
        frameProgress = 1;
    }
    
    const rect = sectionRef.current.getBoundingClientRect();
    const scrollable = rect.height - window.innerHeight;
    
    const targetY = window.scrollY + rect.top + (frameProgress * scrollable);
    window.scrollTo({ top: targetY, behavior: 'smooth' });
  }

  function handleNext() {
    const nextSeqIdx = Math.min(SEQUENCES.length - 1, stateRef.current.currentSeq + 1);
    goToSequence(nextSeqIdx);
  }

  function handlePrev() {
    const prevSeqIdx = Math.max(0, stateRef.current.currentSeq - 1);
    goToSequence(prevSeqIdx);
  }

  return (
    <section ref={sectionRef} className={styles.section} id="video-scrub">
      <div className={styles.stickyWrapper}>
        <div className={styles.container}>

          <div className={styles.headingWrap}>
            <span className={styles.eyebrow}>Process</span>
            <h2 className={styles.heading}>
              Here&rsquo;s what happens<br />to your brief
            </h2>
          </div>

          <div className={styles.card}>

            <button
              ref={leftArrowRef}
              className={`${styles.arrow} ${styles.arrowLeft}`}
              aria-label="Previous sequence"
              data-disabled="true"
              onClick={handlePrev}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
                <path d="M11 3.5L5.5 9L11 14.5" stroke="white" strokeWidth="1.6"
                  strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            <canvas ref={canvasRef} className={styles.canvas} />

            <button
              ref={rightArrowRef}
              className={`${styles.arrow} ${styles.arrowRight}`}
              aria-label="Next sequence"
              onClick={handleNext}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
                <path d="M7 3.5L12.5 9L7 14.5" stroke="white" strokeWidth="1.6"
                  strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            <div className={styles.scrim} aria-hidden />

            <div className={styles.indicator}>
              <span ref={labelRef} className={styles.seqLabel} aria-live="polite">
                {SEQUENCES[0].label}
              </span>
              <div className={styles.dots} role="tablist">
                {SEQUENCES.map((_, i) => (
                  <button
                    key={i}
                    ref={(el) => { dotsRef.current[i] = el; }}
                    className={styles.dot}
                    data-active={i === 0 ? 'true' : 'false'}
                    aria-label={"Jump to sequence " + (i + 1)}
                    role="tab"
                    onClick={() => goToSequence(i)}
                  />
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
