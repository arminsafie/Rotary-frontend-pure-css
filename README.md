# ROTARY — Turntables & Vinyl Audio

A pure HTML/CSS e-commerce frontend for a fictional turntable and vinyl-audio brand. Every visual state, animation, and layout is handled in plain CSS (no framework, no preprocessor); a small vanilla-JS file wires up the handful of interactions CSS can't do on its own.

## Features

- **Fully responsive storefront** — hero section, marquee ticker, featured product, category grid, best-seller cards, and an editorial "workshop" section
- **CSS-only mobile navigation** — the hamburger menu uses the checkbox-hack (`<input type="checkbox">` + `:checked`), no JS required
- **Product detail page** — image gallery with thumbnail swapping, spec list, and an "add to cart" micro-interaction
- **Shopping cart page** — live subtotal/shipping/tax/total recalculation, quantity steppers, row removal with a transition-out animation, and a promo code field (try `GROOVE10` for 10% off)
- **Login / sign-up page** — tabbed auth form, password visibility toggle, and a simulated loading/success state on submit
- **Scroll-reveal animations** via `IntersectionObserver`
- **Newsletter signup** with a simulated subscribe confirmation
- Custom design system built entirely with CSS custom properties (see [Design Tokens](#design-tokens))

## Pages

| File | Description |
|---|---|
| `index.html` | Homepage — hero, featured product, categories, best sellers, brand story, newsletter |
| `product.html` | Product detail page for the "Aurum Belt-Drive Turntable" |
| `cart.html` | Shopping cart ("Your Crate") with live totals |
| `login.html` | Sign in / create account |

## Tech Stack

- **HTML5** — semantic markup, no templating engine
- **CSS3** — hand-written, using CSS custom properties for theming; no Bootstrap/Tailwind/preprocessor
- **Vanilla JavaScript** — a single `js/main.js` file for DOM behavior (cart math, form states, gallery, nav highlighting, scroll reveal)
- **Google Fonts** — Bricolage Grotesque, Inter, Space Mono

No build step, no package manager, and no external JS dependencies — open the HTML files directly or serve them statically.

## Project Structure

```
Rotary-frontend-pure-css/
├── css/
│   ├── reset.css      # Minimal modern CSS reset
│   └── style.css      # Design tokens + all component/layout styles
├── js/
│   └── main.js         # Cart logic, form states, gallery, nav, scroll reveal
├── index.html
├── product.html
├── cart.html
├── login.html
└── README.md
```

## Design Tokens

Defined as CSS custom properties at the top of `css/style.css`:

| Token | Value | Role |
|---|---|---|
| `--ink` / `--ink-soft` / `--ink-raised` | `#14171C` / `#1B1F26` / `#21252E` | Charcoal-navy surfaces |
| `--brass` / `--brass-hi` | `#C6915A` / `#E3AD74` | Primary accent (copper/brass) |
| `--verd` / `--verd-hi` | `#5C8577` / `#86AB9B` | Secondary accent (aged teal) |
| `--paper` | `#E9E3D3` | Warm stone / label panels |
| `--f-display` | Bricolage Grotesque | Headings |
| `--f-body` | Inter | Body copy |
| `--f-mono` | Space Mono | Labels, prices, meta text |

## Getting Started

No installation required — this is a static site.

1. Clone the repo:
   ```bash
   git clone https://github.com/arminsafie/Rotary-frontend-pure-css.git
   cd Rotary-frontend-pure-css
   ```
2. Open `index.html` directly in a browser, **or** serve it locally so relative paths and fonts resolve cleanly:
   ```bash
   npx serve .
   # or
   python3 -m http.server 8000
   ```
3. Visit `http://localhost:8000` (or the port shown) and navigate between the Home, Product, Cart, and Login pages via the header nav.

## Notes

- Product imagery is pulled from Unsplash via hotlinked URLs — swap these for local assets in production.
- The cart and auth flows are front-end simulations only (no backend, no persistence); refreshing the page resets state.
- This project is intended as a UI/design reference or starter template rather than a production storefront.

