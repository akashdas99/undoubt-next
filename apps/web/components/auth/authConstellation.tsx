"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import * as THREE from "three";

let desktopMedia: MediaQueryList | null | undefined;

function getDesktopMedia() {
  if (desktopMedia === undefined) {
    const lg = getComputedStyle(document.documentElement)
      .getPropertyValue("--breakpoint-lg")
      .trim();
    desktopMedia = lg ? window.matchMedia(`(min-width: ${lg})`) : null;
  }
  return desktopMedia;
}

function subscribeDesktop(onChange: () => void) {
  const media = getDesktopMedia();
  if (!media) return () => {};
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

const getDesktopSnapshot = () => getDesktopMedia()?.matches ?? false;
const getDesktopServerSnapshot = () => false;

export function AuthConstellation() {
  const isDesktop = useSyncExternalStore(
    subscribeDesktop,
    getDesktopSnapshot,
    getDesktopServerSnapshot
  );

  if (!isDesktop) return null;

  return <ConstellationCanvas />;
}

function ConstellationCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 1;
    const height = container.clientHeight || 1;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 0, 18);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.9));
    const dirLight = new THREE.DirectionalLight(0x60a5fa, 2);
    dirLight.position.set(10, 15, 10);
    scene.add(dirLight);

    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    const nodeCount = 38;
    const nodes: THREE.Mesh[] = [];
    const nodePositions: THREE.Vector3[] = [];
    const clusterRadius = 6.2;

    for (let i = 0; i < nodeCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = clusterRadius * 0.4 + Math.random() * (clusterRadius * 0.7);
      const position = new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi) * 0.8
      );
      nodePositions.push(position);

      const isMajor = i % 5 === 0;
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(isMajor ? 0.35 : 0.16, 16, 16),
        new THREE.MeshPhongMaterial({
          color: isMajor ? 0xffffff : 0x93c5fd,
          emissive: isMajor ? 0x60a5fa : 0x1d4ed8,
          emissiveIntensity: 0.9,
          shininess: 100,
        })
      );
      mesh.position.copy(position);
      mesh.userData = {
        origPos: position.clone(),
        speed: 0.5 + Math.random() * 0.8,
        offset: Math.random() * Math.PI * 2,
      };
      mainGroup.add(mesh);
      nodes.push(mesh);
    }

    const linesGroup = new THREE.Group();
    mainGroup.add(linesGroup);
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x93c5fd,
      transparent: true,
      opacity: 0.45,
    });

    for (let i = 0; i < nodeCount; i++) {
      const from = nodePositions[i];
      if (!from) continue;
      for (let j = i + 1; j < nodeCount; j++) {
        const to = nodePositions[j];
        if (!to || from.distanceTo(to) >= 4.2) continue;
        const line = new THREE.Line(
          new THREE.BufferGeometry().setFromPoints([from, to]),
          lineMaterial
        );
        line.userData = { idxA: i, idxB: j };
        linesGroup.add(line);
      }
    }

    const particleCount = 80;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particlePositions.length; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 25;
      particlePositions[i + 1] = (Math.random() - 0.5) * 22;
      particlePositions[i + 2] = (Math.random() - 0.5) * 15;
    }
    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(particlePositions, 3)
    );
    const particles = new THREE.Points(
      particleGeometry,
      new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.12,
        transparent: true,
        opacity: 0.5,
      })
    );
    scene.add(particles);

    let targetRotX = 0;
    let targetRotY = 0;
    let mouseRotY = 0;
    let frame = 0;
    let running = false;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const timer = new THREE.Timer();

    const isVisible = () =>
      container.clientWidth > 0 && container.clientHeight > 0;

    const onMouseMove = (event: MouseEvent) => {
      if (!running) return;
      const rect = container.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      targetRotY = ((event.clientX - rect.left) / rect.width - 0.5) * 0.8;
      targetRotX = ((event.clientY - rect.top) / rect.height - 0.5) * 0.8;
    };

    const onResize = () => {
      const nextWidth = container.clientWidth;
      const nextHeight = container.clientHeight;
      if (nextWidth === 0 || nextHeight === 0) return;
      camera.aspect = nextWidth / nextHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(nextWidth, nextHeight);
    };

    const stop = () => {
      running = false;
      cancelAnimationFrame(frame);
    };

    const animate = () => {
      if (!running) return;
      frame = requestAnimationFrame(animate);
      timer.update();
      const elapsed = timer.getElapsed();

      mouseRotY += (targetRotY - mouseRotY) * 0.05;
      mainGroup.rotation.y = elapsed * 0.09 + mouseRotY;
      mainGroup.rotation.x += (targetRotX - mainGroup.rotation.x) * 0.05;
      mainGroup.rotation.z = Math.sin(elapsed * 0.2) * 0.05;

      nodes.forEach((node) => {
        const data = node.userData as {
          origPos: THREE.Vector3;
          speed: number;
          offset: number;
        };
        node.position.y =
          data.origPos.y + Math.sin(elapsed * data.speed + data.offset) * 0.22;
      });

      linesGroup.children.forEach((line) => {
        const { idxA, idxB } = line.userData as { idxA: number; idxB: number };
        const pointA = nodes[idxA]?.position;
        const pointB = nodes[idxB]?.position;
        const position = (line as THREE.Line).geometry.attributes.position;
        if (!pointA || !pointB || !position) return;
        position.setXYZ(0, pointA.x, pointA.y, pointA.z);
        position.setXYZ(1, pointB.x, pointB.y, pointB.z);
        position.needsUpdate = true;
      });

      particles.rotation.y = elapsed * 0.02;
      renderer.render(scene, camera);
    };

    const syncLoop = () => {
      onResize();
      const shouldRun = isVisible() && !motionQuery.matches;
      if (!shouldRun) {
        stop();
        if (isVisible()) renderer.render(scene, camera);
        return;
      }
      if (running) return;
      running = true;
      animate();
    };

    const resizeObserver = new ResizeObserver(syncLoop);
    resizeObserver.observe(container);
    motionQuery.addEventListener("change", syncLoop);
    window.addEventListener("mousemove", onMouseMove);
    syncLoop();

    return () => {
      stop();
      timer.dispose();
      resizeObserver.disconnect();
      motionQuery.removeEventListener("change", syncLoop);
      window.removeEventListener("mousemove", onMouseMove);

      const geometries = new Set<THREE.BufferGeometry>();
      const materials = new Set<THREE.Material>();
      scene.traverse((object) => {
        const mesh = object as THREE.Mesh;
        if (mesh.geometry) geometries.add(mesh.geometry);
        if (!mesh.material) return;
        const list = Array.isArray(mesh.material)
          ? mesh.material
          : [mesh.material];
        for (const material of list) materials.add(material);
      });
      for (const geometry of geometries) geometry.dispose();
      for (const material of materials) material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="h-full w-full [&_canvas]:block [&_canvas]:h-full [&_canvas]:w-full"
    />
  );
}
