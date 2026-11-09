# Diwali, at Home — Akhil Alladi

A personal Diwali experience built with React, TypeScript, Vite, Framer Motion, Three.js and Canvas.

**Live site:** https://akhilalladi-code.github.io/diwali-universe/

## Development

```bash
npm install
npm run dev
```

Create a production build:

```bash
npm run build
npm run preview
```

## Stack

- React 19 + TypeScript
- Vite
- Framer Motion for restrained page transitions
- Three.js for the responsive, pointer-reactive 3D diya sculpture\n- Canvas for optional interactive fireworks
- CSS for the handcrafted visual system and responsive layouts

## Design notes

The visual direction is intentionally warm and editorial: paper-inspired surfaces, hand-drawn rangoli geometry, the supplied diya artwork, and small interactions rather than a wall of effects. Sound is opt-in. The experience respects reduced-motion preferences.

## Deployment

GitHub Actions builds the app and publishes the `dist/` directory to GitHub Pages.
