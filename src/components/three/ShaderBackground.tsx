import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const vertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  
  void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec2 uResolution;
  uniform float uScrollProgress;
  
  varying vec2 vUv;
  varying vec3 vPosition;
  
  // Simplex noise function
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
  
  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                        -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                     + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
                            dot(x12.zw,x12.zw)), 0.0);
    m = m*m;
    m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }
  
  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    for (int i = 0; i < 5; i++) {
      value += amplitude * snoise(p * frequency);
      amplitude *= 0.5;
      frequency *= 2.0;
    }
    return value;
  }
  
  void main() {
    vec2 uv = vUv;
    vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
    
    // Mouse influence
    vec2 mouseInfluence = (uMouse - 0.5) * 0.3;
    float mouseDist = length((uv - 0.5 - mouseInfluence) * aspect);
    
    // Animated noise layers
    float time = uTime * 0.15;
    float noise1 = fbm(uv * 3.0 + time * 0.5);
    float noise2 = fbm(uv * 5.0 - time * 0.3 + mouseInfluence);
    float noise3 = fbm(uv * 8.0 + time * 0.2);
    
    // Chromatic aberration waves from mouse
    float wave = sin(mouseDist * 10.0 - uTime * 2.0) * 0.5 + 0.5;
    float wave2 = sin(mouseDist * 15.0 - uTime * 3.0 + noise1) * 0.5 + 0.5;
    
    // Holographic gradient mesh
    float gradientX = sin(uv.x * 3.14159 + time + noise1 * 0.5) * 0.5 + 0.5;
    float gradientY = cos(uv.y * 3.14159 - time * 0.7 + noise2 * 0.3) * 0.5 + 0.5;
    
    // Color palette - iridescent silver to neon pink
    vec3 silver = vec3(0.75, 0.75, 0.8);
    vec3 pink = vec3(1.0, 0.18, 0.58);
    vec3 cyan = vec3(0.0, 0.94, 1.0);
    vec3 gold = vec3(1.0, 0.84, 0.0);
    vec3 deepBlack = vec3(0.04, 0.04, 0.04);
    
    // Base layer - deep black with subtle noise
    vec3 baseColor = deepBlack + vec3(noise1 * 0.03);
    
    // Mid layer - holographic gradient
    vec3 holoColor = mix(silver, pink, gradientX * gradientY);
    holoColor = mix(holoColor, cyan, wave * 0.3);
    holoColor = mix(holoColor, gold, wave2 * 0.2);
    
    // Apply holographic layer with noise mask
    float holoMask = smoothstep(0.3, 0.7, noise2 * 0.5 + 0.5);
    vec3 color = mix(baseColor, holoColor, holoMask * 0.15);
    
    // Chromatic aberration from mouse position
    float aberrationStrength = (1.0 - smoothstep(0.0, 0.5, mouseDist)) * 0.03;
    float r = fbm(uv * 4.0 + vec2(aberrationStrength, 0.0) + time);
    float g = fbm(uv * 4.0 + time);
    float b = fbm(uv * 4.0 - vec2(aberrationStrength, 0.0) + time);
    color += vec3(r, g, b) * aberrationStrength * wave;
    
    // Scroll progress influence - intensify as you scroll
    float scrollIntensity = uScrollProgress * 0.1;
    color = mix(color, holoColor, scrollIntensity * noise3);
    
    // Vignette
    float vignette = 1.0 - smoothstep(0.3, 1.2, length((uv - 0.5) * aspect));
    color *= vignette * 0.3 + 0.7;
    
    // Subtle pulse
    float pulse = sin(uTime * 0.5) * 0.02 + 1.0;
    color *= pulse;
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

function ShaderPlane() {
  const meshRef = useRef<THREE.Mesh>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const scrollRef = useRef(0);
  
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      uScrollProgress: { value: 0 },
    }),
    []
  );
  
  useFrame((state) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uTime.value = state.clock.elapsedTime;
      
      // Smooth mouse follow
      const targetX = (state.pointer.x + 1) / 2;
      const targetY = (state.pointer.y + 1) / 2;
      mouseRef.current.x += (targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (targetY - mouseRef.current.y) * 0.05;
      material.uniforms.uMouse.value.set(mouseRef.current.x, mouseRef.current.y);
      
      // Scroll progress
      scrollRef.current += (window.scrollY / (document.body.scrollHeight - window.innerHeight) - scrollRef.current) * 0.1;
      material.uniforms.uScrollProgress.value = Math.max(0, Math.min(1, scrollRef.current));
    }
  });
  
  return (
    <mesh ref={meshRef} scale={[2, 2, 1]}>
      <planeGeometry args={[2, 2, 1, 1]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}

export default function ShaderBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 1], fov: 75 }}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
      >
        <ShaderPlane />
      </Canvas>
    </div>
  );
}
