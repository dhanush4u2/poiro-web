"use client";

import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import gsap from "gsap";
import Image from "next/image";

type AnimateFrom = "top" | "bottom" | "left" | "right" | "center" | "random";

export interface MasonryItem {
  id: string;
  src: string;
  type: "image" | "video";
  url: string;
  aspectRatio: number;
}

interface MasonryProps {
  items: MasonryItem[];
  ease?: string;
  duration?: number;
  stagger?: number;
  animateFrom?: AnimateFrom;
  gap?: number;
  scaleOnHover?: boolean;
  hoverScale?: number;
  blurToFocus?: boolean;
  colorShiftOnHover?: boolean;
  animationKey?: number;
}

const VIDEO_PREVIEW_FALLBACK =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 9"><rect width="16" height="9" fill="#151515"/><path d="M6 3.2v2.6L9.2 4.5z" fill="#8a8a8a"/></svg>'
  );

// Responsive column count hook
function useColumnCount() {
  const [cols, setCols] = useState(4);
  useEffect(() => {
    const update = () => {
      if (window.matchMedia("(min-width: 1024px)").matches) setCols(4);
      else if (window.matchMedia("(min-width: 640px)").matches) setCols(3);
      else setCols(2);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return cols;
}

// Measure a DOM element's bounding rect reactively
function useMeasure<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [width, setWidth] = useState(0);
  const frameRef = useRef<number | null>(null);

  useLayoutEffect(() => {
    if (!ref.current) return;

    const update = () => {
      if (!ref.current) return;
      const w = ref.current.getBoundingClientRect().width;
      setWidth((prev) => (prev === w ? prev : w));
    };

    update();

    const ro = new ResizeObserver(() => {
      if (frameRef.current !== null) return;
      frameRef.current = requestAnimationFrame(() => {
        frameRef.current = null;
        update();
      });
    });

    ro.observe(ref.current);
    return () => {
      ro.disconnect();
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return [ref, width] as const;
}

const MASONRY_STYLES = `
  .masonry-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    box-sizing: border-box;
    cursor: pointer;
  }
  .masonry-inner {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 12px;
    overflow: hidden;
    background: #111;
  }
  .masonry-color-overlay {
    position: absolute;
    inset: 0;
    background: #ff5315;
    opacity: 0;
    pointer-events: none;
    border-radius: 12px;
    z-index: 2;
  }
`;

export default function Masonry({
  items,
  ease = "power3.out",
  duration = 0.6,
  stagger = 0.05,
  animateFrom = "bottom",
  gap = 20,
  scaleOnHover = true,
  hoverScale = 0.95,
  blurToFocus = true,
  colorShiftOnHover = false,
  animationKey = 0,
}: MasonryProps) {
  const columns = useColumnCount();
  const [containerRef, containerWidth] = useMeasure<HTMLDivElement>();
  const [hoveredVideoId, setHoveredVideoId] = useState<string | null>(null);
  const [videoPlayingById, setVideoPlayingById] = useState<Record<string, boolean>>({});
  const [previewSrcById, setPreviewSrcById] = useState<Record<string, string>>({});
  const previewCacheRef = useRef<Record<string, boolean>>({});
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});

  const getVideoPreviewSrc = (src: string) =>
    src.replace(/\.(webm|mp4|mov|m4v)(\?.*)?$/i, ".webp$2");

  const checkPreviewExists = async (previewSrc: string) => {
    const cached = previewCacheRef.current[previewSrc];
    if (typeof cached === "boolean") return cached;
    try {
      const res = await fetch(previewSrc, { method: "HEAD" });
      previewCacheRef.current[previewSrc] = res.ok;
      return res.ok;
    } catch {
      previewCacheRef.current[previewSrc] = false;
      return false;
    }
  };

  const getInitialPosition = useCallback(
    (item: MasonryItem & { x: number; y: number; w: number; h: number }) => {
      let dir: AnimateFrom = animateFrom;
      if (animateFrom === "random") {
        const dirs: AnimateFrom[] = ["top", "bottom", "left", "right"];
        dir = dirs[Math.floor(Math.random() * dirs.length)] ?? "bottom";
      }
      switch (dir) {
        case "top":    return { x: item.x, y: -200 };
        case "bottom": return { x: item.x, y: window.innerHeight + 200 };
        case "left":   return { x: -200,   y: item.y };
        case "right":  return { x: window.innerWidth + 200, y: item.y };
        case "center": return { x: item.x + item.w / 2, y: item.y + item.h / 2 };
        default:       return { x: item.x, y: item.y + 100 };
      }
    },
    [animateFrom]
  );

  // Reset video state when items change (tab switch)
  useEffect(() => {
    Object.values(videoRefs.current).forEach((v) => {
      if (!v) return;
      v.pause();
      v.currentTime = 0;
    });
    const raf = requestAnimationFrame(() => {
      setHoveredVideoId(null);
      setVideoPlayingById({});
      videoRefs.current = {};
    });
    return () => cancelAnimationFrame(raf);
  }, [items]);

  // Resolve video preview thumbnails
  useEffect(() => {
    let cancelled = false;
    const videoItems = items.filter((i) => i.type === "video");

    if (!videoItems.length) {
      const raf = requestAnimationFrame(() => setPreviewSrcById({}));
      return () => cancelAnimationFrame(raf);
    }

    const raf = requestAnimationFrame(() => {
      setPreviewSrcById((prev) => {
        const next: Record<string, string> = {};
        for (const item of videoItems) {
          next[item.id] = prev[item.id] ?? VIDEO_PREVIEW_FALLBACK;
        }
        return next;
      });
    });

    const resolve = async () => {
      for (const item of videoItems) {
        if (cancelled) return;
        const previewSrc = getVideoPreviewSrc(item.src);
        const exists = await checkPreviewExists(previewSrc);
        if (cancelled) return;
        setPreviewSrcById((prev) => ({
          ...prev,
          [item.id]: exists ? previewSrc : VIDEO_PREVIEW_FALLBACK,
        }));
      }
    };
    void resolve();

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, [items]);

  // Compute grid layout with gap spacing
  const grid = useMemo(() => {
    if (!containerWidth || containerWidth < 100) return [];
    const gapPx = gap ?? 20;
    const colWidth = (containerWidth - gapPx * (columns - 1)) / columns;
    const colHeights = new Array<number>(columns).fill(0);

    return items.map((item) => {
      const col = colHeights.indexOf(Math.min(...colHeights));
      const aspect = Math.min(Math.max(item.aspectRatio || 1, 0.45), 2.2);
      const x = (colWidth + gapPx) * col;
      const h = colWidth / aspect;
      const y = colHeights[col] ?? 0;
      colHeights[col] = (colHeights[col] ?? 0) + h + gapPx;
      return { ...item, x, y, w: colWidth, h };
    });
  }, [columns, items, containerWidth, gap]);

  const maxHeight = useMemo(
    () => (grid.length ? Math.max(...grid.map((i) => i.y + i.h)) : 0),
    [grid]
  );

  const hasMounted      = useRef(false);
  const lastAnimKey     = useRef(animationKey);

  useLayoutEffect(() => {
    if (!containerRef.current || !grid.length) return;

    const isEntrance = !hasMounted.current || animationKey !== lastAnimKey.current;

    grid.forEach((item, index) => {
      const el = containerRef.current?.querySelector<HTMLElement>(
        `[data-key="${item.id}"]`
      );
      if (!el) return;

      const target = { x: item.x, y: item.y, width: item.w, height: item.h };

      if (isEntrance) {
        const from = getInitialPosition(item);
        gsap.fromTo(
          el,
          {
            opacity: 0,
            x: from.x,
            y: from.y,
            width: item.w,
            height: item.h,
            ...(blurToFocus && { filter: "blur(10px)" }),
          },
          {
            opacity: 1,
            ...target,
            ...(blurToFocus && { filter: "blur(0px)" }),
            duration,
            ease,
            delay: index * stagger,
          }
        );
      } else {
        gsap.to(el, {
          ...target,
          opacity: 1,
          ...(blurToFocus && { filter: "blur(0px)" }),
          duration,
          ease,
          overwrite: "auto",
        });
      }
    });

    hasMounted.current   = true;
    lastAnimKey.current  = animationKey;
  }, [grid, stagger, blurToFocus, duration, ease, animationKey, getInitialPosition, containerRef]);

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>, item: MasonryItem) => {
    if (item.type === "video") {
      setHoveredVideoId(item.id);
      setVideoPlayingById((p) => ({ ...p, [item.id]: false }));
    }
    if (scaleOnHover) {
      gsap.to(e.currentTarget, { scale: hoverScale, force3D: true, duration: 0.3, ease: "power2.out" });
    }
    if (colorShiftOnHover) {
      const overlay = e.currentTarget.querySelector<HTMLDivElement>(".masonry-color-overlay");
      if (overlay) gsap.to(overlay, { opacity: 0.3, duration: 0.3 });
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>, item: MasonryItem) => {
    if (item.type === "video") {
      const v = videoRefs.current[item.id];
      if (v) { v.pause(); v.currentTime = 0; }
      setVideoPlayingById((p) => ({ ...p, [item.id]: false }));
      setHoveredVideoId((cur) => (cur === item.id ? null : cur));
    }
    if (scaleOnHover) {
      gsap.to(e.currentTarget, { scale: 1, force3D: true, duration: 0.3, ease: "power2.out" });
    }
    if (colorShiftOnHover) {
      const overlay = e.currentTarget.querySelector<HTMLDivElement>(".masonry-color-overlay");
      if (overlay) gsap.to(overlay, { opacity: 0, duration: 0.3 });
    }
  };

  return (
    <>
      <style>{MASONRY_STYLES}</style>
      <div
        ref={containerRef}
        style={{
          position: "relative",
          height: maxHeight ? `${maxHeight}px` : "320px",
        }}
      >
        {grid.map((item) => {
          const isActiveVideo   = hoveredVideoId === item.id;
          const isVideoPlaying  = videoPlayingById[item.id] === true;
          const hidePreview     = isActiveVideo && isVideoPlaying;

          return (
            <div
              key={item.id}
              data-key={item.id}
              className="masonry-wrapper"
              onClick={() => window.open(item.url, "_blank", "noopener")}
              onMouseEnter={(e) => handleMouseEnter(e, item)}
              onMouseLeave={(e) => handleMouseLeave(e, item)}
            >
              <div className="masonry-inner">
                {item.type === "video" ? (
                  <>
                    {isActiveVideo && (
                      <video
                        ref={(node) => { videoRefs.current[item.id] = node; }}
                        src={item.src}
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        onPlaying={() =>
                          setVideoPlayingById((p) => ({ ...p, [item.id]: true }))
                        }
                        style={{
                          position: "absolute",
                          inset: 0,
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          zIndex: 0,
                        }}
                      />
                    )}
                    <Image
                      src={previewSrcById[item.id] ?? VIDEO_PREVIEW_FALLBACK}
                      alt="video preview"
                      fill
                      loading="lazy"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      style={{
                        objectFit: "cover",
                        position: "absolute",
                        inset: 0,
                        zIndex: 1,
                        opacity: hidePreview ? 0 : 1,
                        transition: isActiveVideo
                          ? "opacity 0.25s ease-out"
                          : "opacity 0s linear",
                      }}
                      onError={() =>
                        setPreviewSrcById((p) =>
                          p[item.id] === VIDEO_PREVIEW_FALLBACK
                            ? p
                            : { ...p, [item.id]: VIDEO_PREVIEW_FALLBACK }
                        )
                      }
                    />
                  </>
                ) : (
                  <Image
                    src={item.src}
                    alt="gallery image"
                    fill
                    loading="lazy"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    style={{ objectFit: "cover" }}
                  />
                )}
                {colorShiftOnHover && <div className="masonry-color-overlay" />}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
