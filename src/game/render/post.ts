import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { FXAAPass } from "three/addons/postprocessing/FXAAPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import type { Quality } from "./quality";

const GradeShader = {
  uniforms: {
    tDiffuse: { value: null as THREE.Texture | null },
    uTime: { value: 0 },
    uGrain: { value: 0.028 },
    uChroma: { value: 0 },
    uExposure: { value: 1.18 },
    uVignette: { value: 0.12 },
    uTexel: { value: new THREE.Vector2(1 / 1920, 1 / 1080) },
    uSharpen: { value: 0.16 },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform float uTime;
    uniform float uGrain;
    uniform float uChroma;
    uniform float uExposure;
    uniform float uVignette;
    uniform vec2 uTexel;
    uniform float uSharpen;
    varying vec2 vUv;
    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
    }
    void main() {
      vec2 uv = vUv;
      vec3 src = texture2D(tDiffuse, uv).rgb;
      vec3 n = texture2D(tDiffuse, uv + vec2(0.0, uTexel.y)).rgb;
      vec3 s = texture2D(tDiffuse, uv - vec2(0.0, uTexel.y)).rgb;
      vec3 e = texture2D(tDiffuse, uv + vec2(uTexel.x, 0.0)).rgb;
      vec3 w = texture2D(tDiffuse, uv - vec2(uTexel.x, 0.0)).rgb;
      vec3 col = src * (1.0 + 4.0 * uSharpen) - (n + s + e + w) * uSharpen;
      col *= uExposure;
      col = max(col, vec3(0.0));
      col = col * 0.92 + vec3(0.062);
      float lum = dot(col, vec3(0.2126, 0.7152, 0.0722));
      vec3 shadowTint = vec3(0.78, 0.82, 0.86);
      vec3 midTint = vec3(1.06, 0.97, 0.86);
      col = mix(col * shadowTint, col, smoothstep(0.04, 0.32, lum));
      col *= mix(midTint, vec3(1.0), smoothstep(0.22, 0.72, lum));
      vec2 q = uv * 2.0 - 1.0;
      float vig = 1.0 - dot(q, q) * uVignette;
      col *= vig;
      float g = hash(uv * (uTime * 19.0 + 3.1) + vec2(uTime));
      col += (g - 0.5) * uGrain;
      gl_FragColor = vec4(col, 1.0);
    }
  `,
};

export class PostPipeline {
  composer: EffectComposer;
  bloom: UnrealBloomPass | null = null;
  grade: ShaderPass;
  fxaa: FXAAPass;
  quality: Quality;
  chromaT = 0;
  popT = 0;

  constructor(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.Camera, quality: Quality) {
    this.quality = quality;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.38;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.composer = new EffectComposer(renderer);
    this.composer.addPass(new RenderPass(scene, camera));
    if (quality.bloom) {
      this.bloom = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.14, 0.2, 0.93);
      this.composer.addPass(this.bloom);
    }
    this.grade = new ShaderPass(GradeShader);
    this.grade.uniforms.uGrain.value = quality.grain ? 0.028 : 0.008;
    this.grade.uniforms.uSharpen.value = quality.low ? 0.1 : 0.16;
    this.grade.uniforms.uVignette.value = 0.12;
    this.grade.uniforms.uExposure.value = 1.18;
    this.composer.addPass(this.grade);
    this.fxaa = new FXAAPass();
    this.composer.addPass(this.fxaa);
    this.composer.addPass(new OutputPass());
    this.setSize(window.innerWidth, window.innerHeight);
  }

  setSize(w: number, h: number) {
    const dpr = this.quality.dpr;
    this.composer.setSize(w, h);
    this.composer.setPixelRatio(dpr);
    this.fxaa.setSize(w * dpr, h * dpr);
    this.bloom?.setSize(w, h);
    this.grade.uniforms.uTexel.value.set(1 / Math.max(1, w * dpr), 1 / Math.max(1, h * dpr));
  }

  punch(_chroma = 0, pop = 0.1) {
    this.chromaT = 0;
    this.popT = Math.max(this.popT, pop);
    this.grade.uniforms.uChroma.value = 0;
  }

  render(dt: number) {
    this.chromaT = 0;
    this.popT = Math.max(0, this.popT - dt);
    this.grade.uniforms.uTime.value += dt;
    this.grade.uniforms.uChroma.value = 0;
    this.grade.uniforms.uExposure.value = 1.18 + this.popT * 0.28;
    this.composer.render();
  }
}
