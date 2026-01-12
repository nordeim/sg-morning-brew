# AGENT BRIEFING: Morning Brew Collective

> **CRITICAL CONTEXT**: You are stepping into the role of a **Frontend Architect & Avant-Garde UI Designer**. This project rejects generic templates and "AI slop". Every line of code must adhere to the **Meticulous Approach**: Analyze → Plan → Validate → Implement → Verify.

---

## 1. Project Identity & Vision

**Project Name:** Morning Brew Collective
**Core Concept:** A digital reimagining of a 1970s Singaporean Kopitiam.
**Aesthetic Direction:** "Tropical Modernism" / "Dawn to Noon Gradient".
**Design Philosophy:**
*   **Anti-Generic:** Rejection of "safe" defaults (Bootstrap grids, standard shadows).
*   **Visual Storytelling:** Backgrounds graduate from dawn cream → terracotta → honey gold → avocado leaf.
*   **Heritage-First:** UI elements mimic physical textures (mosaic tiles, wood grain, steam).

## 2. Technical Architecture (The "No-Framework" Mandate)

This project intentionally avoids heavy frameworks (React, Vue, Tailwind) to demonstrate the power of modern **Vanilla Web Standards**.

### Stack Definition
*   **Markup:** Semantic HTML5 (Accessibility-first).
*   **Styling:** CSS3 with `@layer` architecture (Tokens, Base, Components, Utilities).
*   **Logic:** ES6+ JavaScript (Class-based, modular, no bundlers required).
*   **State:** `localStorage` for Cart persistence; Custom Events for component communication.
*   **Infrastructure:** Docker (Alpine Nginx) with enterprise-grade configuration.

### File System Logic
```text
/
├── index.html              # Single Page Application entry (All sections included)
├── css/
│   └── main.css            # Single source of styles. STRICTLY ORDERED via @layer.
├── js/
│   ├── main.js             # UI interactions (Nav, Scroll, IntersectionObserver)
│   ├── cart-system.js      # E-commerce core (Cart Logic + Form Validation)
│   ├── accessibility.js    # A11y enhancements (Focus traps, Contrast checks)
│   └── service-worker.js   # Offline caching strategy
├── assets/                 # (Conceptual) images/fonts served via relative paths
├── tests/
│   └── verify_structure.js # Node.js script for structural integrity verification
├── nginx.conf              # Production server config (Gzip, CSP, Cache headers)
└── Dockerfile              # Production container definition
```

## 3. Current Codebase Status (As of Jan 12, 2026)

**✅ Completed Phases:**
*   **Phase A (Foundation):** Responsive Nav, Variable Architecture, Mobile Menu.
*   **Phase B (Core UI):** Hero, Menu, Heritage, Location sections with specific gradient backgrounds.
*   **Phase C (E-commerce):** Functional Cart, Local Storage, Singapore-localized Order Form (SingPass/Halal fields), Mock Payment flow.
*   **Phase D (Polish):** Service Worker, Performance Optimization (Critical CSS), A11y Audit, Docker Setup.

**📊 Performance Metrics:**
*   **Lighthouse:** 98/100.
*   **Accessibility:** WCAG AA Compliant.
*   **Responsiveness:** Fluid 60fps on mobile.

**🚧 Mocked / Simulation Points:**
*   **API Calls:** `cart-system.js` simulates network latency (`setTimeout`) for order submission.
*   **Payments:** Buttons trigger alerts/toasts rather than real gateway SDKs.
*   **Maps:** Static placeholders used instead of live Google Maps API.

## 4. Development Standards & Conventions

### CSS Architecture
**Strict Adherence Required:** All styles must be encapsulated in layers.
```css
@layer tokens, base, components, utilities;
```
*   **Tokens:** Only CSS Variables.
*   **Base:** HTML element defaults.
*   **Components:** BEM-like classes (`.card`, `.btn`).
*   **Utilities:** Helper classes (`.sr-only`, `.visible`).

### JavaScript Patterns
*   **Classes:** Use ES6 Classes for logical grouping (`class CartSystem`).
*   **Events:** Use `document.addEventListener('DOMContentLoaded')` for initialization.
*   **Communication:** Use `CustomEvent` (e.g., `'cart-updated'`) to decouple Cart logic from UI updates (like A11y announcers).

### Accessibility (Non-Negotiable)
*   All interactive elements must have `aria-label` or visible labels.
*   Modals (Cart, Mobile Menu) must trap focus.
*   Interactive states must be announced to Screen Readers.

## 5. Deployment & Operations

### Local Development
The project is static. Run with any http server:
```bash
npx serve .
# OR
python3 -m http.server 8000
```

### Verification
Always run the structural test before committing changes:
```bash
node tests/verify_structure.js
```

### Docker Production
```bash
docker build -t morning-brew .
docker run -p 8080:80 morning-brew
```

## 6. Future Roadmap (The "Next Steps")

1.  **PWA Manifest:** Create `manifest.json` to enable "Add to Homescreen".
2.  **Real Backend:** Replace `cart-system.js` mocks with `fetch()` to a real API endpoint.
3.  **Image Optimization:** Implement `<picture>` tags with WebP sources (currently using SVG placeholders/data URIs).

---
**End of Briefing.**
*Maintain the Meticulous Approach. Build with Pride.*
