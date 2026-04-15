'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './VideoScrub.module.css';

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 301; /* frame_00000 to frame_00300 */
const FRAME_PATH = '/frames/';

export default function VideoScrub() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [framesLoaded, setFramesLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const imagesRef = useRef<HTMLImageElement[]>([]);

  /* Generate padded frame filename */
  const getFramePath = useCallback((index: number) => {
    const padded = String(index).padStart(5, '0');
    return `${FRAME_PATH}frame_${padded}.webp`;
  }, []);

  /* Preload frames */
  useEffect(() => {
    let loaded = 0;
    let hasError = false;
    const images: HTMLImageElement[] = [];

    const loadFrame = (index: number): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          loaded++;
          setLoadProgress(Math.round((loaded / TOTAL_FRAMES) * 100));
          resolve(img);
        };
        img.onerror = () => {
          hasError = true;
          reject(new Error(`Failed to load frame ${index}`));
        };
        img.src = getFramePath(index);
      });
    };

    /* Load first frame to test if frames exist */
    loadFrame(0)
      .then((img) => {
        images[0] = img;

        /* Load remaining frames */
        const promises = [];
        for (let i = 1; i < TOTAL_FRAMES; i++) {
          promises.push(
            loadFrame(i).then((loadedImg) => {
              images[i] = loadedImg;
            })
          );
        }

        return Promise.all(promises);
      })
      .then(() => {
        imagesRef.current = images;
        setFramesLoaded(true);
      })
      .catch(() => {
        /* Frames not found — debug mode */
        setFramesLoaded(false);
      });
  }, [getFramePath]);

  /* Draw frame to canvas */
  const drawFrame = useCallback(
    (frameIndex: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      if (framesLoaded && imagesRef.current[frameIndex]) {
        const img = imagesRef.current[frameIndex];
        canvas.width = img.naturalWidth || 1920;
        canvas.height = img.naturalHeight || 1080;
        ctx.drawImage(img, 0, 0);
      }
    },
    [framesLoaded]
  );

  /* GSAP ScrollTrigger for scrubbing */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: '+=300%',
      pin: true,
      scrub: 0.5,
      anticipatePin: 1,
      onUpdate: (self) => {
        const frameIndex = Math.min(
          TOTAL_FRAMES - 1,
          Math.floor(self.progress * (TOTAL_FRAMES - 1))
        );
        setCurrentFrame(frameIndex);
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  /* Draw whenever frame changes */
  useEffect(() => {
    drawFrame(currentFrame);
  }, [currentFrame, drawFrame]);

  const progress = (currentFrame / (TOTAL_FRAMES - 1)) * 100;

  return (
    <section ref={sectionRef} className={styles.section} id="video-scrub">
      <div className={styles.canvasWrap}>
        {framesLoaded ? (
          <canvas ref={canvasRef} className={styles.canvas} />
        ) : (
          /* Debug / Fallback UI */
          <div className={styles.debugView}>
            <canvas ref={canvasRef} className={styles.canvas} style={{ display: 'none' }} />
            <div className={styles.debugContent}>
              <div className={styles.debugFrame}>
                <span className={styles.debugFrameNum}>{String(currentFrame).padStart(5, '0')}</span>
              </div>
              <p className={styles.debugLabel}>
                Frame {currentFrame} / {TOTAL_FRAMES - 1}
              </p>
              <div className={styles.debugBarWrap}>
                <div className={styles.debugBar} style={{ width: `${progress}%` }} />
              </div>
              <p className={styles.debugHint}>
                {loadProgress > 0 && loadProgress < 100
                  ? `Loading frames... ${loadProgress}%`
                  : 'Add frames to /public/frames/ to see video scrub'}
              </p>
            </div>
          </div>
        )}

        {/* Progress indicator */}
        <div className={styles.progressWrap}>
          <div className={styles.progressBar} style={{ height: `${progress}%` }} />
        </div>
      </div>
    </section>
  );
}
