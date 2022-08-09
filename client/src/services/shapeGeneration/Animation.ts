import {
  AmbientLight,
  DirectionalLight,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  Scene,
  Vector3,
  WebGLRenderer,
} from "three";
import { OrbitControls } from "./OrbitControls.js";
import type { Geometry, Object3D } from "three";

class Animation {
  private readonly DEFAULT_MATERIAL = new MeshStandardMaterial({
    metalness: 0.6,
    color: 0xe1c7ac,
  });
  private scene!: Scene;
  private meshObject!: Object3D;
  private renderer!: WebGLRenderer;
  private camera!: PerspectiveCamera;
  private cameraControls!: OrbitControls;
  public setUp(canvas: HTMLCanvasElement): void {
    this.initialize(canvas);
    this.loop();
  }
  public update(geometry: Geometry, resolution: number): void {
    this.scene.remove(this.meshObject);

    const newMeshObject = new Mesh(geometry, this.DEFAULT_MATERIAL);

    const scale = 2 / resolution;
    newMeshObject.position.x = (-resolution / 2.0) * scale;
    newMeshObject.position.y = (-resolution / 2.0) * scale;
    newMeshObject.position.z = (-resolution / 2.0) * scale;
    newMeshObject.scale.set(scale, scale, scale);

    this.meshObject = newMeshObject;
    this.scene.add(newMeshObject);
  }
  private initialize(canvas: HTMLCanvasElement): void {
    this.camera = this.createCamera();
    this.scene = this.createScene(this.camera);
    this.cameraControls = this.createCameraControls(this.camera, canvas);
    this.renderer = this.createRenderer(canvas);
  }

  private createRenderer(canvas: HTMLCanvasElement): WebGLRenderer {
    const renderer = new WebGLRenderer({ canvas, antialias: true });
    renderer.setClearColor(0xf5f5f5, 1);
    return renderer;
  }
  private createCamera(): PerspectiveCamera {
    const FOV = 35;
    const aspect = window.innerWidth / window.innerHeight;
    const NEAR = 1;
    const FAR = 10000;
    const camera = new PerspectiveCamera(FOV, aspect, NEAR, FAR);
    camera.position.set(0, 0, 40);
    const resize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", resize, false);
    return camera;
  }
  private createAmbientLight(): AmbientLight {
    return new AmbientLight(0xffffff);
  }
  private create3PtLighting(camera: PerspectiveCamera): DirectionalLight[] {
    const { x, y, z } = camera.position;
    const keyLight = new DirectionalLight(0xffffff);
    const fillLight = new DirectionalLight(0xaaaaaa);
    const backendLight = new DirectionalLight(0x888888);
    keyLight.position.set(x, y, z).normalize();
    fillLight.position.set(x, y, -z).normalize();
    backendLight.position.set(-x, -y, -z).normalize();
    return [keyLight, fillLight, backendLight];
  }
  private createScene(camera: PerspectiveCamera): Scene {
    const scene = new Scene();
    const ambientLight = this.createAmbientLight();
    const [keyLight, fillLight, backendLight] = this.create3PtLighting(camera);
    scene.add(ambientLight);
    scene.add(keyLight, fillLight, backendLight);
    scene.add(camera);
    return scene;
  }
  private createCameraControls(
    camera: PerspectiveCamera,
    canvas: HTMLCanvasElement
  ): OrbitControls {
    const cameraControls = new OrbitControls(camera, canvas);
    cameraControls.enableDamping = true;
    cameraControls.dampingFactor = 0.1;
    cameraControls.enablePan = false;
    cameraControls.rotateSpeed = 1.5;
    cameraControls.position0 = new Vector3(0.03, -0.32, 0.5);
    cameraControls.position0.multiplyScalar(6);
    cameraControls.reset();
    return cameraControls;
  }
  private loop(): void {
    requestAnimationFrame(this.loop.bind(this));
    this.cameraControls.update();
    this.renderer.render(this.scene, this.camera);
  }
}

export default Animation;
