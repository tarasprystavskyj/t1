import * as THREE from 'three'
import React, { forwardRef, useMemo } from 'react'
import { extend } from '@react-three/fiber'

class GlowMaterialImpl extends THREE.ShaderMaterial {
  constructor() {
    super({
      uniforms: {
        time: { value: 0 },
        color: { value: new THREE.Color('#66ccff') },
        intensity: { value: 1.0 },
        power: { value: 2.0 },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vWorldPosition;
        void main(){
          vNormal = normalize(normalMatrix * normal);
          vec4 worldPosition = modelMatrix * vec4(position,1.0);
          vWorldPosition = worldPosition.xyz;
          gl_Position = projectionMatrix * viewMatrix * worldPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        uniform float intensity;
        uniform float power;
        varying vec3 vNormal;
        varying vec3 vWorldPosition;
        void main(){
          vec3 viewDir = normalize(cameraPosition - vWorldPosition);
          float fresnel = pow(1.0 - max(dot(viewDir, normalize(vNormal)), 0.0), power);
          float glow = smoothstep(0.0, 1.0, fresnel) * intensity;
          gl_FragColor = vec4(color * glow, glow * 0.85);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })
  }
}
extend({ GlowMaterialImpl })

const GlowMaterial = forwardRef((props, ref) => {
  const mat = useMemo(() => new GlowMaterialImpl(), [])
  return <primitive object={mat} ref={ref} attach="material" {...props} />
})
export default GlowMaterial
