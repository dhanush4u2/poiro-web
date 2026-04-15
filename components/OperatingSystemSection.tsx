"use client";

import { useState } from "react";
import Image from "next/image";

// ── Service data ──────────────────────────────────────────────────────────────
const SERVICES = [
  {
    num: "01",
    title: "Brand Strategy",
    items: [
      "Brand Positioning",
      "Logo Design",
      "Brand Guidelines",
      "Pitch Decks",
      "Packaging Design",
      "Brand Revamps",
    ],
    img: "/os/brand_strategy.avif",
    imgAlt: "Brand Strategy",
  },
  {
    num: "02",
    title: "Websites",
    items: [
      "Website Design & Development",
      "Web Apps & Platforms",
      "Web Revamps",
      "Conversion Rate Optimisations",
      "Search Engine Optimisation (SEO)",
      "Website Management",
    ],
    img: "/os/websites.avif",
    imgAlt: "Websites",
  },
  {
    num: "03",
    title: "Product Design",
    items: [
      "User Research & Analysis",
      "UX Audits",
      "MVP Planning & Design",
      "UI Design & Prototyping",
      "Product Management",
    ],
    img: "/os/brand_design.avif",
    imgAlt: "Product Design",
  },
  {
    num: "04",
    title: "AI-Powered\nSolutions",
    items: [
      "AI Applications",
      "Agentic AI Orchestration",
      "SaaS Products",
      "AI Chatbots",
      "AI Automations",
      "Intelligent Integrations",
    ],
    img: "/os/ai_solutions.avif",
    imgAlt: "AI-Powered Solutions",
  },
  {
    num: "05",
    title: "Motion Design",
    items: [
      "Motion Graphics",
      "Explainer Videos",
      "Brand Launch Videos",
      "Interactive Presentations",
    ],
    img: "/os/motion_design.avif",
    imgAlt: "Motion Design",
  },
  {
    num: "06",
    title: "Full-stack\nMarketing",
    items: [
      "Marketing & Growth Strategy",
      "Emails & Newsletters",
      "Copywriting",
      "Technical Content Writing",
      "Campaigns",
      "Social Media Management",
      "Community, Events, Podcasts",
      "Strategic Partnerships",
      "Personal Brand Management",
    ],
    img: "/os/full_stack.avif",
    imgAlt: "Full-stack Marketing",
  },
];

// A hairline that fades out at both edges — elegant on dark backgrounds
function Divider() {
  return (
    <div
      style={{
        height: 1,
        background:
          "linear-gradient(to right, transparent 0%, rgba(255,255,255,0.12) 20%, rgba(255,255,255,0.12) 80%, transparent 100%)",
      }}
    />
  );
}

// =============================================================================
export default function OperatingSystemSection() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=Roboto:wght@300;400;500&display=swap');
        .os-section * { box-sizing: border-box; }
      `}</style>

      <section
        className="os-section"
        style={{
          backgroundColor: "#000000",
          padding: "clamp(80px, 12vh, 140px) 0",
          fontFamily: "'Roboto', sans-serif",
          position: "relative",
          zIndex: 10,
        }}
      >
        {/* ── Section header ──────────────────────────────────── */}
        <div
          style={{
            maxWidth: "min(1100px, 88vw)",
            margin: "0 auto",
            padding: "0 24px",
            marginBottom: "clamp(64px, 10vh, 120px)",
          }}
        >
          {/* Label */}
          <span
            style={{
              fontFamily: "'Roboto', sans-serif",
              fontSize: "clamp(11px, 0.9vw, 13px)",
              fontWeight: 400,
              color: "rgba(255, 255, 255, 0.3)",
              letterSpacing: "2.5px",
              textTransform: "uppercase",
              display: "block",
              marginBottom: 24,
            }}
          >
            Our Services
          </span>

          {/* Main heading */}
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(40px, 5.5vw, 80px)",
              fontWeight: 300,
              color: "rgba(240, 234, 222, 0.95)",
              letterSpacing: "-0.5px",
              lineHeight: 1.05,
              margin: 0,
            }}
          >
            An Operating System
            <br />
            <em style={{ fontWeight: 300 }}>for Storytelling.</em>
          </h2>

          {/* Subline */}
          <p
            style={{
              fontFamily: "'Roboto', sans-serif",
              fontSize: "clamp(14px, 1.1vw, 17px)",
              fontWeight: 300,
              color: "rgba(255, 255, 255, 0.35)",
              marginTop: 24,
              lineHeight: 1.7,
              maxWidth: 480,
            }}
          >
            Every service built to compound — so your brand, product,
            and growth all move in the same direction.
          </p>
        </div>

        {/* ── Service rows ────────────────────────────────────── */}
        <div
          style={{
            maxWidth: "min(1100px, 88vw)",
            margin: "0 auto",
            padding: "0 24px",
          }}
        >
          {/* Top border */}
          <Divider />

          {SERVICES.map((svc, i) => {
            const isHovered = hovered === i;
            return (
              <div key={i}>
                {/* Service row */}
                <div
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: "clamp(24px, 3vw, 48px)",
                    alignItems: "center",
                    padding: "clamp(40px, 5.5vh, 72px) 0",
                    transform: isHovered ? "scale(1.02)" : "scale(1)",
                    transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                    cursor: "default",
                  }}
                >
                  {/* Left column: number + title */}
                  <div>
                    <span
                      style={{
                        fontFamily: "'Roboto', sans-serif",
                        fontSize: "clamp(11px, 0.9vw, 13px)",
                        fontWeight: 400,
                        color: "rgba(255, 255, 255, 0.28)",
                        letterSpacing: "0.5px",
                        display: "block",
                        marginBottom: 10,
                      }}
                    >
                      ({svc.num})
                    </span>
                    <h3
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: "clamp(28px, 3vw, 44px)",
                        fontWeight: 400,
                        color: "rgba(240, 234, 222, 0.9)",
                        letterSpacing: "-0.3px",
                        lineHeight: 1.1,
                        margin: 0,
                        whiteSpace: "pre-line",
                      }}
                    >
                      {svc.title}
                    </h3>
                  </div>

                  {/* Center column: service items */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "clamp(6px, 0.8vh, 10px)",
                    }}
                  >
                    {svc.items.map((item, j) => (
                      <span
                        key={j}
                        style={{
                          fontFamily: "'Roboto', sans-serif",
                          fontSize: "clamp(13px, 1.05vw, 15px)",
                          fontWeight: 300,
                          color: "rgba(255, 255, 255, 0.45)",
                          lineHeight: 1.6,
                        }}
                      >
                        {item}
                      </span>
                    ))}
                  </div>

                  {/* Right column: service image */}
                  <div
                    style={{
                      width: "100%",
                      aspectRatio: "4 / 3",
                      borderRadius: 12,
                      overflow: "hidden",
                      position: "relative",
                      transform: isHovered ? "scale(1.03)" : "scale(1)",
                      transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                  >
                    <Image
                      src={svc.img}
                      alt={svc.imgAlt}
                      fill
                      style={{ objectFit: "cover" }}
                      sizes="(max-width: 768px) 90vw, 33vw"
                    />
                  </div>
                </div>

                {/* Divider below every row */}
                <Divider />
              </div>
            );
          })}
        </div>

        {/* ── CTA button ──────────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "clamp(48px, 8vh, 96px)",
          }}
        >
          <a
            href="mailto:founders@redomedia.co"
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "14px 32px",
              border: "1px solid rgba(255, 255, 255, 0.18)",
              borderRadius: 10,
              backgroundColor: "transparent",
              color: "rgba(240, 234, 222, 0.75)",
              fontFamily: "'Roboto', sans-serif",
              fontSize: 15,
              fontWeight: 400,
              letterSpacing: "0.2px",
              textDecoration: "none",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)";
              e.currentTarget.style.color = "rgba(240,234,222,1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)";
              e.currentTarget.style.color = "rgba(240,234,222,0.75)";
            }}
          >
            Build Your Vision With Us
          </a>
        </div>
      </section>
    </>
  );
}
