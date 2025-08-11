import React, { useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { a, useSpring } from '@react-spring/three'

export default function OrbitElement({ radius = 4, speed = 0.2, label = 'Panel', index = 0 }) {
  const ref = useRef()
  const [hovered, setHovered] = useState(false)

  const { scale, emissive } = useSpring({
    scale: hovered ? 1.2 : 1.0,
    emissive: hovered ? 1.2 : 0.4,
    config: { mass: 1, tension: 260, friction: 20 }
  })

  useFrame((state) => {
    const t = state.clock.elapsedTime * speed + index * 0.7
    const x = Math.cos(t) * radius
    const z = Math.sin(t) * radius
    const y = Math.sin(t * 1.7) * 0.25
    if (ref.current) {
      ref.current.position.set(x, y, z)
      ref.current.rotation.y = -t + Math.PI/2
    }
  })

  const panelArgs = useMemo(() => [1.6, 1.0, 8, 8], [])
  return (
    <a.group ref={ref} scale={scale}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <mesh castShadow receiveShadow>
        <roundedPlaneGeometry args={panelArgs} />
        <a.meshStandardMaterial
          transparent
          opacity={0.25}
          color={'#99ccff'}
          emissive={'#66aaff'}
          emissiveIntensity={emissive}
          roughness={0.25}
          metalness={0.1}
        />
      </mesh>
      <mesh position={[0,0,0.01]}>
        <planeGeometry args={[1.55, 0.96]} />
        <meshBasicMaterial transparent opacity={0.1} />
      </mesh>
      {hovered && (
        <Html center distanceFactor={8}>
          <div class="tooltip">{label}</div>
        </Html>
      )}
    </a.group>
  )
}

/* Rounded plane geometry helper (small, inline) */
import * as THREE from 'three'
import { extend } from '@react-three/fiber'
class RoundedPlaneGeometry extends THREE.BufferGeometry {
  constructor(width=1, height=1, segmentsW=8, segmentsH=8, radius=0.12) {
    super()
    const shape = new THREE.Shape()
    const hw = width/2, hh = height/2, r = Math.min(radius, hw, hh)
    shape.moveTo(-hw + r, -hh)
    shape.lineTo(hw - r, -hh)
    shape.quadraticCurveTo(hw, -hh, hw, -hh + r)
    shape.lineTo(hw, hh - r)
    shape.quadraticCurveTo(hw, hh, hw - r, hh)
    shape.lineTo(-hw + r, hh)
    shape.quadraticCurveTo(-hw, hh, -hw, hh - r)
    shape.lineTo(-hw, -hh + r)
    shape.quadraticCurveTo(-hw, -hh, -hw + r, -hh)
    const geom = new THREE.ShapeGeometry(shape, Math.max(segmentsW, segmentsH))
    this.copy(geom)
    this.computeVertexNormals()
  }
}
extend({ RoundedPlaneGeometry })
