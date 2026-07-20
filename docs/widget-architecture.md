# Widget System Architecture

This document defines the modular structure and architecture of the Blovi Widget System.

---

## Directory Overview

```
app/embed/
├── components/     # Reusable UI primitives (Cards, Avatars, Ratings, Modals, Badges)
├── layouts/        # Layout implementations (Wall of Love, Carousel, Marquee, Single Quote)
├── theme/          # Theme color palettes, radii, fonts, and design tokens
├── types/          # Shared contracts, configuration, and layout prop interfaces
└── utils/          # Widget utilities (iframe resizing, text truncation, helpers)
```

---

## 1. `components/` — Reusable UI Primitives

Contains standalone, presentational sub-components used across various widget layouts:

- **Avatar** — Author profile avatar rendering with fallback initials and platform badge indicators (Twitter, Product Hunt).
- **Stars** — Star rating indicators with customizable colors and size.
- **BadgeLink** — "Powered by Blovi" branding badge.
- **VerifiedBadge** — Verification checkmark linking to Blovi verification endpoint.
- **EmptyState** — Placeholder display when no testimonials are present.
- **TestimonialCard** — Unified testimonial card component.
- **TestimonialModal** — Expanded view modal for long-form testimonials.

---

## 2. `layouts/` — Layout Implementations

Contains individual widget layout engines. Each layout component implements the canonical `WidgetLayoutProps` contract:

- **Wall** (`WallContent`) — Responsive masonry/flex grid layout with pagination and tag filtering.
- **Carousel** (`CarouselContent`) — Single-card or multi-card horizontal slider with autoplay, touch swipe, and control arrows.
- **Marquee** (`MarqueeContent`) — Infinite horizontal scrolling marquee track with hover pause.
- **SingleQuote** (`SingleQuoteContent`) — Featured quote layout (`card` or `minimal` variants).

---

## 3. `theme/` — Theme & Design Tokens

Manages visual styling tokens and theme resolution logic:

- **`types.ts`** — Definition of `ThemeColors` palette contract.
- **`tokens.ts`** — `THEME` preset colors (light & dark modes), `RADIUS_PX` scale, `FONT` stack definition, and the dynamic `buildStyle()` resolver.
- **`index.ts`** — Barrel export for the theme module.

---

## 4. `types/` — Shared Contracts

Defines the core TypeScript interfaces that establish predictable contracts across the widget system:

- **`widget.ts`**:
  - `WidgetType` — `"wall" | "carousel" | "marquee" | "single"`
  - `WidgetRadius` — `"sharp" | "rounded" | "pill"`
  - `WidgetTheme` — `"light" | "dark"`
  - `WidgetStyle` — `{ colors: ThemeColors; radius: number }`
  - `WidgetLayoutProps` — Unified base props required by every layout engine.
  - `WallLayoutProps`, `SingleQuoteLayoutProps`, `CarouselLayoutProps`, `MarqueeLayoutProps` — Specific layout prop contracts.
  - `WidgetConfig` — Client-side parsed widget configuration settings.
- **`testimonial.ts`**:
  - Re-exports the core `Testimonial` data model interface.
- **`index.ts`**:
  - Barrel export for the types module.

---

## 5. `utils/` — Widget Utilities

Contains core DOM and browser communication helper functions:

- **`sendWidgetHeight()`** — Calculates wrapper height and dispatches `proofkit-resize` postMessage to host window for iframe auto-resizing.
- **`truncate()`** — Helper function for safe text clamping with ellipsis.
