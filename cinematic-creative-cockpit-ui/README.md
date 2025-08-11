# Cinematic Creative Cockpit UI (React + Three.js)

A small Blade Runner 2049 / Apple Vision Pro–inspired cockpit scene built with React + @react-three/fiber.

## Live demo
Upload this folder as a project to **CodeSandbox** or **StackBlitz** to get an instant public URL.

- **CodeSandbox**: New → Import Project → Upload the ZIP you downloaded.
- **StackBlitz**: Create new JavaScript app → "Import Project" → Upload ZIP.

> This repo is Vite-based and works out-of-the-box in both sandboxes.

## Scripts
```bash
npm install
npm run dev     # http://localhost:5173
npm run build
npm run preview # local static preview
```

## Files
- `src/App.jsx` – scene, camera rig, postprocessing (Bloom, Vignette, GodRays)
- `src/Logo.jsx` – central glowing logo with a subtle wobble
- `src/OrbitElement.jsx` – reusable orbiting translucent panels with hover glow + tooltip
- `src/HUD.jsx` – thin sci‑fi rings and spokes
- `src/shaders/GlowMaterial.js` – minimal GLSL fresnel glow

## Customize
- **Logo text**: change `<Logo text="COCKPIT" />` in `App.jsx`.
- **Colors**: tweak material colors/emissive in `Logo.jsx`, `OrbitElement.jsx`, or `GlowMaterial` color.
- **Orbits**: edit the `orbits` array in `App.jsx` (radius/speed/label).
- **Camera**: adjust `minPolarAngle`, `maxPolarAngle`, and distances on `<OrbitControls />`.
- **Autorotate**: it turns on after ~2.5s of inactivity (change `idleMs` on `<AutoplayControls />`).

## Notes
- Tooltips use `<Html>` from `drei`. Replace with `<Text>` if you prefer fully in‑scene 3D labels.
- The scene uses slight fog + GodRays for atmosphere. If performance is low on mobile, remove `GodRays` or lower Bloom intensity.
