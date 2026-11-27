/* ==== a3d/facade.js · map dot material that grows glass, mullions and floors as uFacade → 1 ==== */
import * as THREE from '../vendor/three.module.min.js';

/* footprint in map cells: towers stand on 0.64 of each 1 × 1 cell, floors are 0.27 cells tall */
const head = [
  'uniform float uFacade;',
  'varying vec3 vLP; varying vec3 vON;',
  'float fh(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }'
].join('\n');

const body = [
  'float fac = 0.0, wid = 0.0, glow = 0.0;',
  'if (uFacade > 0.001) {',
  '  vec2 cell = floor(vLP.xz);',
  '  float hs = fh(cell), y = vLP.y;',
  '  if (abs(vON.y) < 0.5) {',
  '    float u = abs(vON.x) > 0.5 ? vLP.z : vLP.x;',
  '    float c = clamp(fract(u - 0.18) / 0.64, 0.0, 1.0);',
  '    float fl = y / 0.27, fy = fract(fl), win = 0.0;',
  '    if (hs < 0.42) {',
  '      float cx = fract(c * 5.0);',
  '      win = step(0.16, cx) * step(cx, 0.84) * step(0.24, fy) * step(fy, 0.86);',
  '    } else if (hs < 0.72) {',
  '      win = step(0.34, fy) * step(fy, 0.94) * step(0.06, fract(c * 10.0));',
  '    } else {',
  '      win = step(0.06, fy) * step(0.05, fract(c * 8.0));',
  '    }',
  '    if (y < 0.3) win = step(0.03, y) * step(y, 0.24) * step(0.04, fract(c * 4.0));',
  '    win *= step(0.025, c) * step(c, 0.975);',
  '    wid = fh(vec2(floor(c * 5.0) + cell.x * 7.0, floor(fl) + cell.y * 13.0));',
  '    fac = win * uFacade;',
  '    glow = step(0.94, wid) * step(0.3, y);',
  '    vec3 glass = mix(vec3(0.11, 0.14, 0.17), vec3(0.24, 0.28, 0.32), wid);',
  '    diffuseColor.rgb *= 1.0 - 0.08 * uFacade * step(fy, 0.05);',
  '    diffuseColor.rgb *= mix(1.0, mix(0.62, 1.0, smoothstep(0.0, 0.5, y)), uFacade);',
  '    diffuseColor.rgb = mix(diffuseColor.rgb, glass, fac);',
  '  } else {',
  '    diffuseColor.rgb *= mix(1.0, 0.82 + hs * 0.1, uFacade);',
  '  }',
  '}'
].join('\n');

export function facadeMaterial() {
  const uFacade = { value: 0 };
  const mat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.82, metalness: 0 });
  mat.onBeforeCompile = function (sh) {
    sh.uniforms.uFacade = uFacade;
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vLP; varying vec3 vON;')
      .replace('#include <begin_vertex>', [
        '#include <begin_vertex>',
        'vec4 lp4 = vec4(transformed, 1.0);',
        '#ifdef USE_INSTANCING',
        'lp4 = instanceMatrix * lp4;',
        '#endif',
        'vLP = lp4.xyz; vON = objectNormal;'
      ].join('\n'));
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', '#include <common>\n' + head)
      .replace('#include <color_fragment>', '#include <color_fragment>\n' + body)
      .replace('#include <roughnessmap_fragment>', '#include <roughnessmap_fragment>\nroughnessFactor = mix(roughnessFactor, 0.05 + wid * 0.14, fac);')
      .replace('#include <metalnessmap_fragment>', '#include <metalnessmap_fragment>\nmetalnessFactor = mix(metalnessFactor, 0.9, fac);')
      .replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\ntotalEmissiveRadiance += vec3(1.0, 0.8, 0.58) * glow * fac * 0.35;');
  };
  mat.customProgramCacheKey = function () { return 'tesway-facade'; };
  mat.userData.uFacade = uFacade;
  return mat;
}
