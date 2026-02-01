# Zisth – Company Website

React + TypeScript company site with **3D Spline** and **Framer Motion** animations, built with **Vite** for fast dev and optimized production builds.

## Stack

- **React 19** + **TypeScript (TSX)** – typed components
- **Vite 7** – fast HMR and ESM builds
- **@splinetool/react-spline** – embed 3D Spline scenes
- **Framer Motion** – page and UI animations

## Commands

```bash
npm install   # install dependencies
npm run dev   # dev server (http://localhost:5173)
npm run build # production build
npm run preview # preview production build
```

## Adding Your Spline Scene

1. In [Spline](https://spline.design): **File → Export → Code → React**
2. Copy the scene URL or download the `.splinecode` file
3. In `src/components/SplineScene.tsx`, set the `scene` prop:
   - URL: `scene="https://prod.spline.design/.../scene.splinecode"`
   - Or self-host: put the file in `public/` and use `scene="/your-scene.splinecode"` (avoids CORS)

## Performance

- **Code splitting**: React, Spline, and Framer Motion are in separate chunks
- **Lazy loading**: Spline scene is loaded with `React.lazy()` so it doesn’t block first paint
- **Optimized deps**: Vite pre-bundles key dependencies for faster dev

## Project Structure

```
src/
  main.tsx          # entry
  App.tsx            # root layout + hero + Spline
  App.css
  index.css          # global styles
  components/
    SplineScene.tsx  # Spline 3D (lazy-loaded)
```

Replace the demo Spline URL in `SplineScene.tsx` with your own scene and extend `App.tsx` with your sections and Framer Motion animations.
