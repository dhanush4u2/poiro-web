"use client";

import { useRef, useEffect } from "react";

interface HighlighterProps {
  children: React.ReactNode;
  show: boolean;
  action: "crossed-off" | "underline";
  color?: string;
  padding?: number;
  strokeWidth?: number;
}

export function Highlighter({
  children,
  show,
  action,
  color = "#ff8015",
  padding = 2,
  strokeWidth = 2,
}: HighlighterProps) {
  const pathRef = useRef<SVGPathElement>(null);

  // Set up dasharray on mount so the line starts hidden
  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    path.style.strokeDasharray = "100";
    path.style.strokeDashoffset = "100";
  }, []);

  // Animate in/out when show toggles
  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    path.style.strokeDashoffset = show ? "0" : "100";
  }, [show]);

  // SVG geometry — slight hand-drawn wave for character
  const svgH = strokeWidth + 4;
  const y = svgH / 2;
  // A gentle S-curve that looks natural rather than mechanical
  const d = `M0,${y} C25,${y - 1.2} 75,${y + 1.2} 100,${y}`;

  const svgStyle: React.CSSProperties = {
    position: "absolute",
    left: -padding,
    width: `calc(100% + ${padding * 2}px)`,
    height: svgH,
    overflow: "visible",
    pointerEvents: "none",
  };

  if (action === "underline") {
    svgStyle.bottom = -(svgH + 1);
  } else {
    // crossed-off: sit through the vertical centre of the text
    svgStyle.top = "50%";
    svgStyle.transform = "translateY(-50%)";
  }

  return (
    <span style={{ position: "relative", display: "inline-block" }}>
      {children}
      <svg
        aria-hidden="true"
        viewBox={`0 0 100 ${svgH}`}
        preserveAspectRatio="none"
        style={svgStyle}
      >
        <path
          ref={pathRef}
          d={d}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          style={{
            transition: "stroke-dashoffset 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />
      </svg>
    </span>
  );
}
