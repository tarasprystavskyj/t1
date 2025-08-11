import React, { useMemo, useRef } from 'react'
import { Line } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

function Circle({ r=3.5, segments=120, ...props }) {
  const points = useMemo(() => {
    const pts = []
    for (let i=0;i<=segments;i++){
      const a = (i/segments) * Math.PI * 2
      pts.push([Math.cos(a)*r, Math.sin(a)*0.02, Math.sin(a)*r]) // slight tilt
    }
    return pts
  }, [r, segments])
  return <Line points={points} {...props} />
}

export default function HUD() {
  const g = useRef()
  useFrame((state) => {
    if (g.current){
      const t = state.clock.elapsedTime
      g.current.rotation.y = t * 0.02
    }
  })
  return (
    <group ref={g}>
      <Circle r={3.0} lineWidth={1} color={'#3b6bb5'} opacity={0.6} transparent />
      <Circle r={4.0} lineWidth={1} color={'#2f5ea8'} opacity={0.5} transparent />
      <Circle r={5.2} lineWidth={1} color={'#2a4e8f'} opacity={0.4} transparent />
      {/* radial spokes */}
      {[...Array(6)].map((_, i) => {
        const a = (i/6) * Math.PI * 2
        const x = Math.cos(a), z = Math.sin(a)
        return (
          <Line
            key={i}
            points={[[x*2.2, 0, z*2.2],[x*6.5, 0, z*6.5]]}
            color={'#335f9e'}
            lineWidth={0.8}
            opacity={0.35}
            transparent
          />
        )
      })}
    </group>
  )
}
