import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

export function initThreeScene() {
  const heroVisual = document.querySelector('.hero-visual');
  if (!heroVisual) {
    return;
  }

  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-label', '3D abstract background');
  canvas.style.position = 'absolute';
  canvas.style.inset = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '0';
  canvas.style.opacity = '0.9';

  heroVisual.insertBefore(canvas, heroVisual.firstChild);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, heroVisual.clientWidth / heroVisual.clientHeight, 0.1, 1000);
  camera.position.set(0, 0, 6);

  const ambient = new THREE.AmbientLight(0xbfe3ff, 1);
  scene.add(ambient);

  const pointLight = new THREE.PointLight(0x5aa8ff, 2, 50);
  pointLight.position.set(5, 5, 5);
  scene.add(pointLight);

  const group = new THREE.Group();
  scene.add(group);

  const mainGeometry = new THREE.IcosahedronGeometry(1.5, 0);
  const mainMaterial = new THREE.MeshStandardMaterial({
    color: 0x77b9ff,
    emissive: 0x12386d,
    metalness: 0.55,
    roughness: 0.25,
    transparent: true,
    opacity: 0.95
  });

  const core = new THREE.Mesh(mainGeometry, mainMaterial);
  group.add(core);

  const ringGeometry = new THREE.TorusKnotGeometry(2.1, 0.42, 80, 12);
  const ringMaterial = new THREE.MeshStandardMaterial({
    color: 0xb089ff,
    emissive: 0x2c1f58,
    metalness: 0.7,
    roughness: 0.25,
    transparent: true,
    opacity: 0.9
  });

  const ring = new THREE.Mesh(ringGeometry, ringMaterial);
  ring.rotation.x = Math.PI / 2.5;
  ring.rotation.y = Math.PI / 4;
  group.add(ring);

  const particleCount = window.innerWidth < 768 ? 200 : 400;
  const particlePositions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount * 3; i += 3) {
    particlePositions[i] = (Math.random() - 0.5) * 15;
    particlePositions[i + 1] = (Math.random() - 0.5) * 15;
    particlePositions[i + 2] = (Math.random() - 0.5) * 10;
  }

  const particlesGeometry = new THREE.BufferGeometry();
  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

  const particlesMaterial = new THREE.PointsMaterial({
    color: 0xc8f2ff,
    size: 0.025,
    transparent: true,
    opacity: 0.6
  });

  const particles = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particles);

  const mouse = { x: 0, y: 0 };
  const onPointerMove = (event) => {
    if (!heroVisual) return;
    const rect = heroVisual.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  };

  window.addEventListener('pointermove', onPointerMove, { passive: true });

  const resize = () => {
    const { clientWidth, clientHeight } = heroVisual;
    if (!clientWidth || !clientHeight) return;

    renderer.setSize(clientWidth, clientHeight, false);
    camera.aspect = clientWidth / clientHeight;
    camera.updateProjectionMatrix();
  };

  resize();
  window.addEventListener('resize', resize, { passive: true });

  let animationFrameId;
  const render = () => {
    const time = performance.now() * 0.001;

    core.rotation.x = time * 0.6;
    core.rotation.y = time * 0.8;
    ring.rotation.x += 0.004;
    ring.rotation.y += 0.006;
    group.rotation.x = mouse.y * 0.5;
    group.rotation.y = mouse.x * 0.8 + time * 0.2;
    particles.rotation.y = time * 0.08;
    particles.rotation.x = time * 0.03;

    renderer.render(scene, camera);
    animationFrameId = requestAnimationFrame(render);
  };

  render();

  return () => {
    cancelAnimationFrame(animationFrameId);
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('resize', resize);
    renderer.dispose();
  };
}
