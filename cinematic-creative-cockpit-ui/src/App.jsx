import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Environment, Html } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette, GodRays } from '@react-three/postprocessing'
import Logo from './Logo.jsx'
import OrbitElement from './OrbitElement.jsx'
import HUD from './HUD.jsx'

function CameraRig() {
  // Simple cinematic intro: ease camera from far to near on mount
  const { camera } = useThree()
  const t0 = useRef(performance.now())
  useFrame(() => {
    const t = (performance.now() - t0.current) / 1500 // 1.5s
    const k = Math.min(1, t)
    // easeOutCubic
    const e = 1 - Math.pow(1 - k, 3)
    camera.position.set(0, 0.8 * (1 - e), 10 - 2*e)
    camera.lookAt(0, 0, 0)
  })
  return null
}

function AutoplayControls({ idleMs = 2500 }) {
  const controls = useRef()
  const idle = useRef(false)
  const [lastMove, setLastMove] = useState(performance.now())
  useEffect(() => {
    const onMove = () => setLastMove(performance.now())
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])
  useFrame(() => {
    const now = performance.now()
    const shouldAuto = now - lastMove > idleMs
    if (controls.current) controls.current.autoRotate = shouldAuto
    if (shouldAuto !== idle.current) idle.current = shouldAuto
  })
  return (
    <OrbitControls
      ref={controls}
      enablePan={false}
      enableDamping
      dampingFactor={0.08}
      autoRotateSpeed={0.4}
      minDistance={4}
      maxDistance={14}
      minPolarAngle={Math.PI * 0.35}
      maxPolarAngle={Math.PI * 0.65}
    />
  )
}

function SunGlow() {
  // light + small emissive sphere for GodRays
  const ref = useRef()
  return (
    <group position={[0, 0, -8]}>
      <mesh ref={ref}>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshBasicMaterial color={'#66ccff'} />
      </mesh>
      <pointLight position={[0,0,0]} intensity={4} color={'#88ccff'} />
      <GodRays sun={ref} samples={30} density={0.9} decay={0.95} weight={0.4} exposure={0.3} clampMax={1.0} />
    </group>
  )
}

export default function App() {
  const orbits = useMemo(() => [
    { r: 3.0, speed: 0.25, label: 'Navigation' },
    { r: 3.8, speed: -0.18, label: 'Systems' },
    { r: 4.6, speed: 0.2, label: 'Telemetry' },
    { r: 5.4, speed: -0.15, label: 'Comms' },
    { r: 6.2, speed: 0.12, label: 'Analytics' },
  ], [])

  return (
    <>
      <div id="overlay">Cinematic Creative Cockpit UI · React + Three.js (R3F)</div>
      <Canvas
        shadows
        gl={{ antialias: true, preserveDrawingBuffer: true }}
        camera={{ fov: 48, near: 0.1, far: 60, position: [0, 0.8, 10] }}
      >
        <color attach="background" args={[0x0a/255, 0x0b/255, 0x10/255]} />
        <fog attach="fog" args={[0x06070c, 12, 40]} />
        <ambientLight intensity={0.4} />
        <spotLight position={[6, 6, 6]} angle={0.35} penumbra={0.3} intensity={2} castShadow color={'#7fb8ff'} />
        <Suspense fallback={<Html center><div class="tooltip">Loading assets…</div></Html>}>
          <CameraRig />
          <Logo text="COCKPIT" />
          {orbits.map((o, i) => (
            <OrbitElement key={i} radius={o.r} speed={o.speed} label={o.label} index={i} />
          ))}
          <HUD />
          <Environment preset="night" background={false} blur={0.8} />
          <EffectComposer multisampling={4}>
            <Bloom luminanceThreshold={0.0} luminanceSmoothing={0.7} intensity={0.8} />
            <Vignette eskil={false} offset={0.25} darkness={0.8} />
            <SunGlow />
          </EffectComposer>
        </Suspense>
        <AutoplayControls />
      </Canvas>
    </>
  )
}
