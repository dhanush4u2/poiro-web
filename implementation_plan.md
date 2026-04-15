# Poiro — Premium Next.js Website

Build a production-grade, Apple-style animated website for **Poiro Storytelling OS** with scroll-driven frame scrubbing, premium micro-interactions, and a dark cinematic design.

---

## User Review Required

> [!IMPORTANT]
> **Frame Scrub Section Placement**: The video scrub section (301 frames) will be placed between the "System Architecture" section and the "Poiro Studio" section. This feels natural as it transitions from the product explanation into the studio demo. Let me know if you want it elsewhere.

> [!IMPORTANT]
> **Framework Choices**: Using **GSAP + ScrollTrigger** for all scroll animations and the frame scrub. Using **Lenis** for smooth scrolling. These are industry-standard for Apple-style sites. No heavy 3D — keeping it performant.

> [!WARNING]
> **Frames Folder**: Frames (`frame_00000.webp` to `frame_00300.webp`) are expected in `public/frames/`. Since they don't exist yet, a **debug counter overlay** will show the current frame index during scrubbing. Once frames are added, they'll render automatically.

---

## Design System

| Token | Value |
|---|---|
| **Primary** | `#ff8015` (orange) |
| **Background** | `#000000` |
| **Surface** | `#0a0a0a` / `#111111` |
| **Text Primary** | `#ffffff` |
| **Text Secondary** | `#999999` |
| **Border** | `#222222` |
| **Font Family** | `Helvetica Neue, Helvetica, Arial, sans-serif` |
| **Grid Unit** | `8px` — all spacing is multiples of 8 |
| **Border Radius** | `0px` (brutalist) or `4px` for subtle rounding on cards |
| **Max Content Width** | `1440px` |

---

## Proposed Changes

### 1. Project Scaffolding

#### [NEW] Next.js App (scaffolded via `create-next-app`)
- Next.js 15 with App Router, TypeScript, no Tailwind, no src directory
- Move existing `assets/` into `public/assets/`
- Install dependencies: `gsap`, `@studio-freight/lenis`

#### [NEW] Project structure
```
poiro-web/
├── app/
│   ├── layout.tsx          # Root layout, fonts, metadata
│   ├── page.tsx            # Home page — assembles all sections
│   ├── globals.css         # Design system + global styles
│   └── favicon.ico
├── components/
│   ├── Navbar.tsx          # Sticky navbar with scroll effects
│   ├── Hero.tsx            # Hero with hands, particles, text
│   ├── BrandsMarquee.tsx   # Infinite scrolling brand logos
│   ├── StorytellingSection.tsx  # "Storytelling ≠ Prompting" section
│   ├── LayerByLayer.tsx    # Burger diagram section
│   ├── SystemArchitecture.tsx   # 5 numbered product cards
│   ├── VideoScrub.tsx      # Scroll-driven frame scrubber
│   ├── PoiroStudio.tsx     # "Here's What Happens" section
│   ├── Gallery.tsx         # Our Work tabbed masonry gallery
│   ├── SendIdea.tsx        # CTA with upload / previews
│   ├── Footer.tsx          # Footer with gradient scene
│   └── SmoothScroll.tsx    # Lenis smooth scroll provider
├── hooks/
│   └── useScrollAnimation.ts  # Reusable GSAP scroll hook
├── public/
│   ├── assets/             # Moved from root
│   │   ├── Hero.avif
│   │   ├── LeftHand.avif
│   │   ├── RightHand.avif
│   │   ├── burger.mp4
│   │   ├── logo.png
│   │   ├── o_logo.png
│   │   ├── favicon.ico
│   │   ├── opengraph-image.png
│   │   └── twitter-image.png
│   └── frames/             # frame_00000.webp ... frame_00300.webp
└── package.json
```

---

### 2. Global Styles & Design System

#### [NEW] `app/globals.css`
- CSS custom properties for all colors, spacing, typography
- 8px grid system utilities
- `@media (prefers-reduced-motion: reduce)` — disables all animations
- Dark theme as default
- Smooth scroll behavior
- Typography scale using Helvetica Neue
- Reusable animation keyframes (fadeIn, slideUp, scaleIn, marquee)

---

### 3. Components (top → bottom of page)

#### [NEW] `components/SmoothScroll.tsx`
- Lenis-based smooth scroll wrapper
- Wraps all page content
- Integrates with GSAP ScrollTrigger ticker

---

#### [NEW] `components/Navbar.tsx`
- Fixed position, transparent initially → glass morphism on scroll
- Left: Poiro "o" logo mark
- Center: `Storytelling OS` · `Our Work` · `Try Us`
- Right: `Enter your Idea` button with orange accent
- Hides on scroll down, reveals on scroll up
- Mobile hamburger menu

---

#### [NEW] `components/Hero.tsx`
- Full viewport height
- Background: `Hero.avif` with dark overlay + gradient
- Left hand (`LeftHand.avif`) and right hand (`RightHand.avif`) positioned at top, reaching down with parallax
- Particle effect above light rays (CSS/canvas based subtle particles)
- Center text stack:
  - "Engineering Creativity" (large, bold)
  - "Where AI Meets Brand Storytelling" (subtitle)
  - "Book a Demo ↗" CTA button (orange)
- Scroll-triggered fade and parallax

---

#### [NEW] `components/BrandsMarquee.tsx`
- "Brands we've worked with" heading
- Infinite horizontal marquee (CSS animation, duplicated list)
- Brand names: Chumbak, EFPY, Foramour, Godrej, Stella, Greenfields, Imara
- Two rows scrolling in opposite directions
- Smooth, continuous, no JS required

---

#### [NEW] `components/StorytellingSection.tsx`
- "The Foundation" label
- "Storytelling ≠ Prompting" as large heading
- Paragraph explaining the burger metaphor
- Scroll-triggered text reveal animation (words fading in)

---

#### [NEW] `components/LayerByLayer.tsx`
- "Built Layer by Layer" heading
- Visual stack of layers (burger metaphor):
  - Content Strategy, Audience Insights, Scripting, Creative Direction, Brand & Product
- Each layer animates in on scroll (staggered slide-up)
- Optional: `burger.mp4` video playing in background/alongside

---

#### [NEW] `components/SystemArchitecture.tsx`
- "System Architecture" heading
- "An Operating System for Storytelling." subheading
- 5 numbered cards, each with:
  - Number badge (01–05)
  - Title + Product name
  - Description paragraph
  - Visual preview area (gradient/color block placeholders)
- Cards: Brand Cosmos, Atlas, Infinite Flow, App Studio, Poiro Studio
- Scroll-triggered staggered entrance
- Horizontal scroll or stacked layout depending on viewport

---

#### [NEW] `components/VideoScrub.tsx` ⭐ Key Feature
- Sticky container that pins when entering viewport
- Canvas element displaying current frame
- On scroll within pinned region, scrubs through 301 frames
- Frame naming: `frame_00000.webp` to `frame_00300.webp` from `/frames/`
- **Fallback**: If frames not found, shows:
  - Black background with large frame counter
  - Progress bar showing scrub position
  - "Frame 142 / 300" style debug overlay
- Preloads frames progressively (first 30, then rest)
- Uses `requestAnimationFrame` for smooth canvas rendering
- GSAP ScrollTrigger for scrub progress mapping

---

#### [NEW] `components/PoiroStudio.tsx`
- "Poiro Studio" label
- "Here's What Happens to your Brief." large heading
- Visual showing brief transformation
- Scroll-triggered text animation

---

#### [NEW] `components/Gallery.tsx`
- "Our Work" heading
- Tab filters: Short Form, Statics, UGC/Affiliate, TVC/Animatics
- Masonry grid of video/image previews
- Placeholder cards with gradient backgrounds
- Hover effects: scale + overlay with play button

---

#### [NEW] `components/SendIdea.tsx`
- "Unbelievable right?" heading
- "Send Us Your Idea & We'll Bring It To Life." subheading
- 3 preview thumbnails
- "Upload Brief" CTA with click & share description
- Orange accent styling

---

#### [NEW] `components/Footer.tsx`
- Red/orange gradient background (matching screenshot)
- Large "Engineering Creativity." text
- "Ship more. Spend less. Create without limits." tagline
- Poiro logo
- © 2026 Poiro
- Links: Privacy, Terms, Contact
- Subtle grain/noise texture overlay

---

### 4. Animations Strategy

| Animation | Technique | Trigger |
|---|---|---|
| Navbar show/hide | CSS transform + JS scroll listener | Scroll direction |
| Hero parallax | GSAP ScrollTrigger | Scroll position |
| Particles | CSS keyframe + pseudo-elements | Always running |
| Brand marquee | CSS `@keyframes` infinite | Always running |
| Text reveals | GSAP `SplitText`-style word reveal | ScrollTrigger `start: "top 80%"` |
| Layer stack | GSAP stagger `.from({y: 60, opacity: 0})` | ScrollTrigger |
| Architecture cards | GSAP stagger entrance | ScrollTrigger |
| **Frame scrub** | **GSAP ScrollTrigger pin + scrub** | **Scroll within pinned region** |
| Gallery hover | CSS `transform: scale(1.03)` + overlay | Hover |
| Footer gradient | CSS gradient animation | Viewport entry |

All animations wrapped in `prefers-reduced-motion` check — disabled when user prefers reduced motion.

---

## Open Questions

> [!IMPORTANT]
> 1. **Tab Content for Gallery**: Should the "Our Work" gallery tabs show real content placeholders or just gradient cards? Currently planning gradient placeholder cards.
> 2. **Mobile Responsiveness Priority**: Should I optimize for mobile from the start, or focus on desktop-first and refine mobile later?
> 3. **Brand Logos**: The brand names (Chumbak, EFPY, etc.) — should they be text-only in the marquee, or do you have logo images for them?

---

## Verification Plan

### Automated Tests
- `npm run build` — ensure zero build errors
- `npm run lint` — pass Next.js ESLint rules
- Browser test: navigate all sections, verify scroll animations fire
- Browser test: verify frame scrub counter increments from 0 to 300 on scroll

### Manual Verification
- Visual review of each section against screenshot reference
- Test smooth scrolling behavior end-to-end
- Verify `prefers-reduced-motion` disables animations
- Test navbar hide/show on scroll
- Test brand marquee infinite loop smoothness
- Test frame scrub smoothness and frame accuracy
