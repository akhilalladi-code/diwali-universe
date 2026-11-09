# Diwali Universe

A small, scene-led Diwali experience by Akhil Alladi. Explore a virtual diya ritual, make a little fireworks display, create a personal greeting and learn about the maker.

**Live site:** https://akhilalladi-code.github.io/diwali-universe/

## Built with

- React 19 and TypeScript
- Vite
- Framer Motion for section transitions
- Canvas for optional fireworks
- Lucide React icons
- CSS design tokens and responsive layouts

## Experience

1. **Home** — an editorial Diwali landing page with festival ideas and selected creative projects.
2. **Little Lights** — light five virtual diyas individually, light them all, or reset the ritual.
3. **Create & Share** — compose a greeting, choose its tone, copy the message or export a PNG card.
4. **Our Story** — a short note about the maker and the project.

## Accessibility and preferences

- Keyboard-accessible navigation with a skip link, visible focus styles and Escape-to-close mobile navigation.
- Section changes move focus to the main content.
- Selected controls expose their state to assistive technology.
- The site respects the operating system's reduced-motion preference; fireworks are disabled when reduced motion is requested.
- Sound starts off and can be enabled by the visitor.
- Light and dark themes are supported across the main experience.

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

## Deployment

GitHub Actions builds the Vite `dist/` directory and deploys it to GitHub Pages:

https://akhilalladi-code.github.io/diwali-universe/

The repository uses a Vite base path of `/diwali-universe/` for project-page asset URLs.
