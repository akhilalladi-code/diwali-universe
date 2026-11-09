# Diwali, at Home — Akhil Alladi

A scene-driven Diwali experience built around real illustration assets, small rituals and purposeful motion.

**Live site:** https://akhilalladi-code.github.io/diwali-universe/

## Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- Framer Motion for scene transitions and shared-element movement
- Canvas for interactive fireworks
- Lucide React icons

## The experience

1. **The arrival** — a short, illustrated diya entrance and a focused headline.
2. **The little lights** — five diya objects with individual hover behaviour and lighting states.
3. **The celebration** — interactive canvas fireworks, with optional continuous bursts.
4. **A note for someone** — a personalised greeting composer with copy-to-clipboard.
5. **The maker** — a quiet closing scene with project links.

The existing diya illustration in `public/assets/diya-art.svg` is the primary hero and ritual asset. It is reused rather than replaced with generic stock photography. There are no commercial products in this personal festival project, so the product-inspired scene is expressed through five meaningful diya rituals rather than invented product listings.

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

## Motion and accessibility

- Intro motion is short and can be reduced by the user's system preference.
- The diya uses a shared Framer Motion layout transition from the arrival scene into the first ritual object.
- Fireworks are user-triggered or can be paused; sound is opt-in.
- Layouts are designed for desktop, tablet and mobile.

## Deployment

GitHub Actions builds the Vite `dist/` output and deploys it to GitHub Pages.
