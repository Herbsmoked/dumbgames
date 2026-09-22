import * as THREE from "three";
import type { Item, Slot } from "../types";
import { FigureFactory } from "./figure";
import type { TextureKit } from "./textures";
import type { Quality } from "./quality";

/** Small studio WebGL view of the hero for the inventory paperdoll. */
export class PaperdollView {
  renderer: THREE.WebGLRenderer;
  scene = new THREE.Scene();
  camera: THREE.OrthographicCamera;
  factory: FigureFactory;
  figure: ReturnType<FigureFactory["create"]> | null = null;
  yaw = 0.22;
  private ro: ResizeObserver | null = null;

  constructor(canvas: HTMLCanvasElement, kit: TextureKit, quality: Quality) {
    this.factory = new FigureFactory(kit, quality);
    const rect = canvas.getBoundingClientRect();
    const w = Math.max(64, Math.floor(rect.width) || canvas.clientWidth || 280);
    const h = Math.max(64, Math.floor(rect.height) || canvas.clientHeight || 420);
    const aspect = w / h;
    const f = 1.72;
    this.camera = new THREE.OrthographicCamera(-f * aspect, f * aspect, f, -f, 0.1, 40);
    this.camera.position.set(2.8, 3.1, 2.8);
    this.camera.lookAt(0, 0.95, 0);
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      alpha: false,
      powerPreference: "low-power",
    });
    this.renderer.setPixelRatio(1);
    this.renderer.setSize(w, h, false);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.45;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.setClearColor(0x1c1712, 1);
    this.scene.background = new THREE.Color(0x1c1712);
    try {
      this.scene.environment = kit.env(this.renderer);
      this.scene.environmentIntensity = 0.7;
    } catch {
      /* kit env is optional in the doll studio */
    }
    this.scene.add(new THREE.AmbientLight(0xffe8d0, 1.05));
    const key = new THREE.DirectionalLight(0xffe2c4, 2.1);
    key.position.set(2.2, 4.4, 1.8);
    this.scene.add(key);
    const rim = new THREE.DirectionalLight(0xa8c4ff, 1.1);
    rim.position.set(-2.4, 2.2, -2.2);
    this.scene.add(rim);
    const fill = new THREE.PointLight(0xffc090, 18, 10, 1.4);
    fill.position.set(0.2, 1.8, 2.2);
    this.scene.add(fill);
    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(1.15, 28),
      new THREE.MeshBasicMaterial({ color: 0x2a241c }),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0.01;
    this.scene.add(floor);
    this.figure = this.factory.create("barbarian", 1.0, false, false);
    this.figure.root.position.set(0, 0, 0);
    this.scene.add(this.figure.root);
    this.ro = new ResizeObserver(() => this.fit(canvas));
    this.ro.observe(canvas);
    this.fit(canvas);
  }

  private fit(canvas: HTMLCanvasElement) {
    const rect = canvas.getBoundingClientRect();
    const w = Math.max(64, Math.floor(rect.width));
    const h = Math.max(64, Math.floor(rect.height));
    const aspect = w / Math.max(1, h);
    const f = 1.72;
    this.camera.left = -f * aspect;
    this.camera.right = f * aspect;
    this.camera.top = f;
    this.camera.bottom = -f;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h, false);
  }

  setGear(equipped: Partial<Record<Slot, Item | Item[]>>) {
    this.figure?.applyGear(equipped);
  }

  addYaw(d: number) {
    this.yaw = THREE.MathUtils.clamp(this.yaw + d, -0.4, 0.4);
  }

  tick(dt: number) {
    if (!this.figure) return;
    this.figure.update({
      moving: false,
      speed: 0,
      attacking: false,
      whirlwind: false,
      dead: false,
      freeze: false,
      facing: this.yaw,
      dt,
      time: performance.now() / 1000,
    });
    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    this.ro?.disconnect();
    this.ro = null;
    this.renderer.dispose();
    this.figure = null;
  }
}
