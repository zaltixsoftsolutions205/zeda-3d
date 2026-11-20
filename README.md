# ZEDA – Immersive 3D Website (frontend only)

React + Vite + TypeScript · Three.js / React Three Fiber / drei · GSAP ScrollTrigger · Framer Motion · Tailwind

    npm install
    npm run dev      # http://localhost:5173
    npm run build

One persistent fixed `<Canvas>` (src/components/PersistentCanvas.tsx) holds the whole campus.
`src/hooks/useScrollCamera.ts` builds one scrubbed GSAP timeline that drives `cam.u` (0 = Home … 6 = CTA);
`src/scenes/cameraPath.ts` holds the camera keyframes; `CameraController.tsx` flies the camera with damping.
The campus is procedural (no downloaded assets) and rendered via instanced "kits" for performance.
