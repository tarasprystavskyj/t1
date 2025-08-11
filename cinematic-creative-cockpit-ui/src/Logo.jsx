import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import { AdditiveBlending } from 'three'
import GlowMaterial from './shaders/GlowMaterial.js'

export default function Logo({ text = 'TARAS' }) {
  const group = useRef()
  const glowRef = useRef()
  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (group.current) {
      // subtle wobble
      group.current.rotation.x = Math.sin(t * 0.4) * 0.05
      group.current.rotation.y = Math.cos(t * 0.3) * 0.06
      group.current.position.y = Math.sin(t * 0.6) * 0.08
    }
    if (glowRef.current) {
      glowRef.current.uniforms.time.value = t
    }
  })
  return (
    <group ref={group}>
      <Text
        fontSize={1.2}
        letterSpacing={0.05}
        fontWeight={700}
        anchorX="center"
        anchorY="middle"
        position={[0,0,0]}
      >
        {text}
        <meshStandardMaterial
          color={'#b7dfff'}
          emissive={'#66ccff'}
          emissiveIntensity={1.2}
          metalness={0.2}
          roughness={0.35}
        />
      </Text>
      {/* soft neon plate behind text for extra glow */}
      <mesh position={[0,0,-0.02]}>
        <planeGeometry args={[5.2, 2.0, 1, 1]} />
        <GlowMaterial ref={glowRef} blending={AdditiveBlending} />
      </mesh>
    </group>
  )
}
