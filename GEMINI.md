# Morning Brew Collective Project Context

## Project Overview

**Morning Brew Collective** is a static web application serving as a reference implementation for a high-performance, heritage-focused headless commerce interface. It reimagines a traditional Singaporean Kopitiam with a "Tropical Modernism" aesthetic.

The project is built with **Vanilla HTML, CSS, and JavaScript**, avoiding heavy frameworks to demonstrate modern web platform capabilities like CSS Layers, IntersectionObserver, and Service Workers. It prioritizes accessibility (WCAG AA), performance (Lighthouse 98/100), and mobile-first design.

## Technical Architecture

*   **Type:** Static Web Application (SPA-like feel but multi-section single page).
*   **Frontend:** Semantic HTML5, CSS3 (Custom Properties, `@layer`), ES6+ JavaScript.
*   **State Management:** Vanilla JS + LocalStorage (for the shopping cart).
*   **Offline Support:** Service Worker (`js/service-worker.js`) with cache-first strategy.
*   **Deployment:** Dockerized Nginx (Alpine Linux) with custom enterprise-grade configuration (`nginx.conf`).

## Key Files & Directories

*   `index.html`: The main entry point containing all sections (Hero, Menu, Heritage, Location, Order).
*   `css/main.css`: The central stylesheet using a Layered architecture (Tokens, Base, Components, Utilities). Defines the "Dawn to Noon" gradient system.
*   `js/`:
    *   `main.js`: Core UI interactions, navigation, and scroll animations.
    *   `cart-system.js`: Shopping cart logic, order form validation (Singapore-localized), and mock payment integration.
    *   `accessibility.js`: Helpers for contrast checking and keyboard navigation.
    *   `service-worker.js`: Offline caching logic.
*   `nginx.conf`: Nginx configuration with Gzip compression, security headers (CSP), and caching rules.
*   `tests/verify_structure.js`: A Node.js script to verify the integrity of the project structure and key file contents.
*   `GEMINI_PROJECT_DOCS.md`: Comprehensive generated documentation for the project.

## Development & Usage

### 1. Running Locally
Since this is a static site, it can be served with any simple HTTP server.

**Using Node.js (npx):**
```bash
npx serve .
```

**Using Python:**
```bash
python3 -m http.server 8000
```

### 2. Building/Verifying
There is no complex build step (e.g., Webpack/Vite are not used). However, a verification script ensures the project structure is correct:

```bash
node tests/verify_structure.js
```

### 3. Deployment with Docker
The project includes a production-ready Docker setup.

**Build:**
```bash
docker build -t morning-brew .
```

**Run:**
```bash
docker run -d -p 8080:80 morning-brew
```

## Conventions & Standards

*   **CSS:** Strictly uses `@layer` to manage specificity. No external CSS frameworks (Tailwind, Bootstrap) are used.
*   **JavaScript:** Modular, class-based architecture. No frameworks (React, Vue).
*   **Accessibility:** All interactive elements must have ARIA labels. Contrast ratios must meet WCAG AA.
*   **Localization:** The order form includes Singapore-specific fields (e.g., +65 phone validation) and Halal certification options.
