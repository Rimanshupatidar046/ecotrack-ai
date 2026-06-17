/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export default function ThreeEarth() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragNotice, setDragNotice] = useState(true);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    // Dimensions
    let width = container.clientWidth;
    let height = container.clientHeight || 400;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();

    // Soft dark space background
    scene.background = null; // transparent to allow CSS backgrounds to show through

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 6.5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. Realistic Earth Textures via CDN
    const textureLoader = new THREE.TextureLoader();
    
    // High-res realistic maps
    const earthTexture = textureLoader.load("https://raw.githubusercontent.com/vasturiano/three-globe/master/example/img/earth-blue-marble.jpg");
    const bumpMap = textureLoader.load("https://raw.githubusercontent.com/vasturiano/three-globe/master/example/img/earth-topology.png");
    const waterMap = textureLoader.load("https://raw.githubusercontent.com/vasturiano/three-globe/master/example/img/earth-water.png");
    
    // 3. Earth Globe Mesh
    const geometry = new THREE.SphereGeometry(2, 64, 64);
    
    // Photorealistic material
    const material = new THREE.MeshPhongMaterial({
      map: earthTexture,
      bumpMap: bumpMap,
      bumpScale: 0.05,
      specularMap: waterMap,
      specular: new THREE.Color("#444444"),
      shininess: 35,
    });

    const earth = new THREE.Mesh(geometry, material);
    scene.add(earth);

    // 4. Photorealistic Cloud Layer
    const cloudTexture = textureLoader.load("https://raw.githubusercontent.com/vasturiano/three-globe/master/example/img/earth-clouds.png");
    const cloudGeometry = new THREE.SphereGeometry(2.03, 64, 64);
    const cloudMaterial = new THREE.MeshPhongMaterial({
      map: cloudTexture,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
    scene.add(clouds);

    // 5. Atmospheric Atmosphere Ring
    const glowGeometry = new THREE.SphereGeometry(2.18, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#10b981"),
      transparent: true,
      opacity: 0.12,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending
    });
    const atmosphericGlow = new THREE.Mesh(glowGeometry, glowMaterial);
    scene.add(atmosphericGlow);

    // 6. Flying Carbon / Eco Particles orbiting around
    const particleCount = 130;
    const particlesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const radii: number[] = [];
    const speeds: number[] = [];
    const angles: number[] = [];
    const inclinations: number[] = [];

    const colorGreen = new THREE.Color("#10b981"); // offsets
    const colorCyan = new THREE.Color("#06b6d4"); // emissions

    for (let i = 0; i < particleCount; i++) {
      // radius around the globe
      const r = 2.4 + Math.random() * 1.8;
      radii.push(r);
      speeds.push((0.002 + Math.random() * 0.005) * (Math.random() > 0.5 ? 1 : -1));
      angles.push(Math.random() * Math.PI * 2);
      inclinations.push((Math.random() - 0.5) * (Math.PI * 0.35)); // tilt orbital paths

      // Calculate relative position coords
      const theta = angles[i];
      const phi = inclinations[i];
      const x = r * Math.cos(theta) * Math.cos(phi);
      const y = r * Math.sin(phi);
      const z = r * Math.sin(theta) * Math.cos(phi);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Color grading
      const mixedColor = i % 2 === 0 ? colorGreen : colorCyan;
      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;
    }

    particlesGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    // Custom circular tiny canvas particle texture to look beautiful & organic
    const pCanvas = document.createElement("canvas");
    pCanvas.width = 16;
    pCanvas.height = 16;
    const pCtx = pCanvas.getContext("2d")!;
    const grad = pCtx.createRadialGradient(8, 8, 0, 8, 8, 8);
    grad.addColorStop(0, "rgba(255, 255, 255, 1)");
    grad.addColorStop(0.3, "rgba(255, 255, 255, 0.8)");
    grad.addColorStop(1, "rgba(255, 255, 255, 0)");
    pCtx.fillStyle = grad;
    pCtx.fillRect(0, 0, 16, 16);
    const pTexture = new THREE.CanvasTexture(pCanvas);

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.16,
      map: pTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particleSystem);

    // 7. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.55);
    scene.add(ambientLight);

    const solarLight = new THREE.DirectionalLight(0xffffff, 1.4);
    solarLight.position.set(5, 3, 5); // Simulating sun angle
    scene.add(solarLight);

    // Cyan atmosphere twilight back light
    const twilightLight = new THREE.DirectionalLight(0x06b6d4, 0.85);
    twilightLight.position.set(-5, -2, -5);
    scene.add(twilightLight);

    // 8. Custom Drag & Inertia Interactions (Eliminating heavy OrbitControls)
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let targetRotationX = 0;
    let targetRotationY = 0;
    let currentRotationX = 0;
    let currentRotationY = 0;
    let velocityX = 0;
    let velocityY = 0;

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      setDragNotice(false);
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const deltaMove = {
        x: e.clientX - previousMousePosition.x,
        y: e.clientY - previousMousePosition.y,
      };

      // Calculate momentum velocities
      velocityX = deltaMove.x * 0.005;
      velocityY = deltaMove.y * 0.005;

      targetRotationY += velocityX;
      targetRotationX += velocityY;

      // Keep rotation X bounded to prevent flipping upside down
      targetRotationX = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, targetRotationX));

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    // Touch support for mobile layouts
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        setDragNotice(false);
        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaMove = {
        x: e.touches[0].clientX - previousMousePosition.x,
        y: e.touches[0].clientY - previousMousePosition.y,
      };

      velocityX = deltaMove.x * 0.008;
      velocityY = deltaMove.y * 0.008;

      targetRotationY += velocityX;
      targetRotationX += velocityY;
      targetRotationX = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, targetRotationX));

      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    container.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    container.addEventListener("touchstart", handleTouchStart);
    container.addEventListener("touchmove", handleTouchMove);
    container.addEventListener("touchend", handleMouseUp);

    // 9. Render & Animation Loop
    let animationFrameId: number;

    let lastTime = performance.now();
    let time = 0;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const now = performance.now();
      const delta = (now - lastTime) / 1000;
      lastTime = now;
      time += delta;

      // Apply momentum decay when not dragging
      if (!isDragging) {
        velocityX *= 0.95; // Friction
        velocityY *= 0.95;
        targetRotationY += velocityX;
        targetRotationX += velocityY;
        targetRotationX = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, targetRotationX));
      }

      // Smooth interpolation for dragging physics (lerp)
      currentRotationY += (targetRotationY - currentRotationY) * 0.08;
      currentRotationX += (targetRotationX - currentRotationX) * 0.08;

      // Apply drag controls + natural slow rotation
      earth.rotation.y = currentRotationY + time * 0.025;
      earth.rotation.x = currentRotationX;
      clouds.rotation.y = currentRotationY * 1.1 + time * 0.035;

      // Orbit particles around the globe
      const positionsAttr = particlesGeometry.attributes.position as THREE.BufferAttribute;
      const positionsArr = positionsAttr.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        // Increment angle
        angles[i] += speeds[i];

        const r = radii[i];
        const theta = angles[i];
        const phi = inclinations[i];

        // Orbit calculation with slight floating waving
        const wave = Math.sin(time + i) * 0.08;
        const currentRadius = r + wave;

        const x = currentRadius * Math.cos(theta) * Math.cos(phi);
        const y = currentRadius * Math.sin(phi);
        const z = currentRadius * Math.sin(theta) * Math.cos(phi);

        positionsArr[i * 3] = x;
        positionsArr[i * 3 + 1] = y;
        positionsArr[i * 3 + 2] = z;
      }
      positionsAttr.needsUpdate = true;

      // Render scene
      renderer.render(scene, camera);
    };

    animate();

    // 10. Handle Resize
    const handleResize = () => {
      if (!containerRef.current) return;
      width = containerRef.current.clientWidth;
      height = containerRef.current.clientHeight || 400;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleMouseUp);
      
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      earthTexture.dispose();
      cloudGeometry.dispose();
      cloudMaterial.dispose();
      cloudTexture.dispose();
      glowGeometry.dispose();
      glowMaterial.dispose();
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      pTexture.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-full min-h-[380px] md:min-h-[500px]" id="three-earth-canvas-container">
      <div 
        ref={containerRef} 
        className="w-full h-full cursor-grab active:cursor-grabbing focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-inset"
        role="application"
        aria-label="Interactive 3D Earth. Drag with mouse or swipe to rotate."
        tabIndex={0}
      />
      
      {/* Immersive subtle radar pulse indicator overlays */}
      <div className="absolute top-4 left-4 flex items-center space-x-2 bg-slate-900/45 backdrop-blur-md px-3 py-1.5 rounded-full border border-emerald-500/30 text-xs font-mono text-emerald-400 select-none pointer-events-none animate-pulse">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
        <span>ECO: GLOBAL TELEMETRY</span>
      </div>

      {dragNotice && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900/60 backdrop-blur-lg border border-slate-700/50 px-4 py-2 rounded-xl text-xs text-slate-300 font-sans pointer-events-none select-none text-center shadow-lg transition-all duration-300">
          Drag to rotate 3D Earth & inspect carbon flow
        </div>
      )}
    </div>
  );
}
