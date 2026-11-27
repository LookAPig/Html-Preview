/* ==== a3d/sky.js · gradient sky dome, image-based light from the same sky, sun + fill ==== */
import * as THREE from '../vendor/three.module.min.js';
import { mobile } from './kit.js';

const skyVert = 'varying vec3 vDir; void main(){ vDir = normalize(position); vec4 p = modelViewMatrix * vec4(position,1.0); gl_Position = projectionMatrix * p; gl_Position.z = gl_Position.w * 0.99999; }';
const skyFrag = [
  'uniform vec3 uHor; uniform vec3 uTop; uniform vec3 uSun; uniform vec3 uSunDir; uniform float uGlow;',
  'varying vec3 vDir;',
  'void main(){',
  '  vec3 d = normalize(vDir);',
  '  float h = clamp(d.y, 0.0, 1.0);',
  '  vec3 c = mix(uHor, uTop, smoothstep(0.0, 0.85, h));',
  '  float s = max(dot(d, normalize(uSunDir)), 0.0);',
  '  c += uSun * (pow(s, 24.0) * 0.35 + pow(s, 900.0) * 1.2) * uGlow;',
  '  c = mix(c, uHor, smoothstep(0.02, -0.08, d.y));',
  '  gl_FragColor = vec4(c, 1.0);',
  '}'
].join('\n');

export const SUN_DIR = new THREE.Vector3(-0.55, 0.62, 0.42).normalize();

function dome(glow) {
  const mat = new THREE.ShaderMaterial({
    vertexShader: skyVert, fragmentShader: skyFrag, side: THREE.BackSide, depthWrite: false, fog: false, toneMapped: false,
    uniforms: {
      uHor: { value: new THREE.Color(0xF6F6F6) }, uTop: { value: new THREE.Color(0xDCE5EE) },
      uSun: { value: new THREE.Color(0xFFF1DE) }, uSunDir: { value: SUN_DIR }, uGlow: { value: glow }
    }
  });
  const m = new THREE.Mesh(new THREE.SphereGeometry(1, 48, 24), mat);
  m.frustumCulled = false;
  m.renderOrder = -10;
  return m;
}

export function buildSky(renderer, scene) {
  /* environment: a brighter copy of the sky plus a warm ground bounce, prefiltered once */
  const envScene = new THREE.Scene();
  const envSky = dome(2.2);
  envSky.scale.setScalar(50);
  envScene.add(envSky);
  const ground = new THREE.Mesh(new THREE.CircleGeometry(50, 32), new THREE.MeshBasicMaterial({ color: 0xBDBAB4, side: THREE.DoubleSide }));
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -6;
  envScene.add(ground);
  const pm = new THREE.PMREMGenerator(renderer);
  scene.environment = pm.fromScene(envScene, 0.02).texture;
  scene.environmentIntensity = 0.75;
  pm.dispose();

  const sky = dome(1);
  sky.scale.setScalar(1000);
  scene.add(sky);

  const hemi = new THREE.HemisphereLight(0xEEF3F8, 0xCFC8BC, 0.85);
  const sun = new THREE.DirectionalLight(0xFFF1DE, 3.1);
  sun.castShadow = true;
  const sz = mobile.matches ? 1024 : 2048;
  sun.shadow.mapSize.set(sz, sz);
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 0.03;
  scene.add(hemi, sun, sun.target);

  const off = new THREE.Vector3(), snap = new THREE.Vector3();
  const lz = SUN_DIR.clone().negate();
  const lx = new THREE.Vector3().crossVectors(lz, new THREE.Vector3(0, 1, 0)).normalize();
  const ly = new THREE.Vector3().crossVectors(lx, lz);
  /* the shadow box follows the view, snapped to whole shadow texels so edges never crawl */
  function aim(target, spread, cam) {
    sky.position.copy(cam.position);
    const sh = sun.shadow.camera;
    sh.left = sh.bottom = -spread; sh.right = sh.top = spread;
    sh.near = 1; sh.far = spread * 6;
    sh.updateProjectionMatrix();
    const tx = spread * 2 / sz;
    snap.copy(target).setY(0);
    const a = Math.round(snap.dot(lx) / tx) * tx, b = Math.round(snap.dot(ly) / tx) * tx, c = snap.dot(lz);
    sun.target.position.copy(lx).multiplyScalar(a).addScaledVector(ly, b).addScaledVector(lz, c);
    off.copy(SUN_DIR).multiplyScalar(spread * 2.5);
    sun.position.copy(sun.target.position).add(off);
  }
  return { sky: sky, sun: sun, hemi: hemi, aim: aim };
}
