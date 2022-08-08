import { InferenceSession, Tensor } from "onnxjs";
import { Face3, Geometry, Vector3 } from "three";
import EventBus from "services/bus/EventBus";
import marchingCubes from "./marchingcubes";
import getGrid from "./TensorGrid";
import STLFile from "./STLFile";
import LatentCode from "./LatentCode";
import Animation from "./Animation";

const BATCH_SIZE = 4096;

export const onnxSession = new InferenceSession({ backendHint: "webgl" });

const animation = new Animation();

class Shape {
  public static isGenerating: boolean = false;
  public static eventBus = new EventBus();
  private latentCode!: Float32Array;
  private resolution!: number;
  private batchCount!: number;
  private surfaceLevel!: number;
  private latentCodeScalingFactor!: number;
  private grid!: Tensor[];
  private latentCodeBatch!: Tensor;
  private sdfBatches!: Float32Array[];
  private startTime!: number;
  private mesh!: { vertices: number[][]; triangles: number[][] };
  private voxels!: Float32Array;
  constructor(
    latentCode: Float32Array,
    resolution: number,
    latentCodeScalingFactor: number = 1,
    level: number = 0.04,
    canvas: HTMLCanvasElement
  ) {
    this.latentCode = latentCode;
    this.resolution = resolution;
    this.batchCount = Math.ceil(Math.pow(resolution, 3) / BATCH_SIZE);
    this.surfaceLevel = level;
    this.latentCodeScalingFactor = latentCodeScalingFactor;
    animation.setUp(canvas);
  }

  public generate(): void {
    setStatus("Generating...");
    Shape.isGenerating = true;
    this.grid = getGrid(this.resolution);
    this.latentCodeBatch = LatentCode.createBatch(
      this.latentCode,
      this.latentCodeScalingFactor
    );
    this.sdfBatches = [];
    this.startTime = new Date().getTime();
    setTimeout(this.updateBatch.bind(this), 20);
  }

  private updateBatch(): void {
    if (this.sdfBatches.length == this.batchCount) {
      setStatus("Voxelizing...");
      setTimeout(this.onInferenceComplete.bind(this), 0);
    } else {
      const batchIndex: number = this.sdfBatches.length;
      const input: Tensor[] = [this.grid[batchIndex], this.latentCodeBatch];

      const runOnnxInference = async (): Promise<void> => {
        try {
          const output = await onnxSession.run(input);
          this.sdfBatches.push(output.values().next().value.data);
          this.updateBatch();
        } catch (error) {
          console.error;
        }
      };

      const progress = Math.floor((batchIndex / this.batchCount) * 100);
      setStatus(`Generating... ${progress} %"`);
      Shape.eventBus.emit("progress", { progress });
      setTimeout(runOnnxInference, 300);
    }
  }

  private onInferenceComplete(): void {
    const inferenceTime: number = new Date().getTime() - this.startTime;
    console.log(
      `Inference complete. ${this.batchCount} batches, resolution ${this.resolution}, time: ${inferenceTime} ms`
    );
    const paddedResolution: number = this.resolution + 2;
    const voxels = new Float32Array(Math.pow(paddedResolution, 3));
    voxels.fill(1);
    for (let x = 0; x < this.resolution; x++) {
      for (let y = 0; y < this.resolution; y++) {
        for (let z = 0; z < this.resolution; z++) {
          const index: number =
            x * this.resolution * this.resolution + y * this.resolution + z;
          const networkOutput: number =
            this.sdfBatches[Math.floor(index / BATCH_SIZE)][index % BATCH_SIZE];
          const voxelIndex: number =
            (x + 1) * paddedResolution * paddedResolution +
            (y + 1) * paddedResolution +
            z +
            1;
          voxels[voxelIndex] = networkOutput - this.surfaceLevel;
        }
      }
    }

    const dims = Array(3).fill(paddedResolution) as [number, number, number];
    const potential = (x: number, y: number, z: number): number =>
      voxels[
        paddedResolution * paddedResolution * x + paddedResolution * y + z
      ];
    this.mesh = marchingCubes(dims, potential);
    this.voxels = voxels;
    this.show();
    Shape.isGenerating = false;
    setStatus("");
    Shape.eventBus.emit("progress", { progress: 100 });
  }

  public updateSurfaceLevel(newLevel: number): void {
    const difference: number = this.surfaceLevel - newLevel;
    this.surfaceLevel = newLevel;
    for (let i = 0; i < this.voxels.length; i++) this.voxels[i] += difference;

    const paddedResolution: number = this.resolution + 2;
    const dims = Array(3).fill(paddedResolution) as [number, number, number];
    const potential = (x: number, y: number, z: number): number =>
      this.voxels[
        paddedResolution * paddedResolution * x + paddedResolution * y + z
      ];
    this.mesh = marchingCubes(dims, potential);
    this.show();
  }

  public saveSTLFile(): void {
    const blob = new Blob([STLFile.create(this.mesh)], {
      type: "application/octet-stream",
    });
    const link: HTMLAnchorElement = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "shape.stl";
    link.click();
  }

  private createGeometry(): THREE.Geometry {
    const geometry = new Geometry();

    this.mesh.vertices.forEach((vtx: number[]): void => {
      const vertex = new Vector3(vtx[0], vtx[1], vtx[2]);
      geometry.vertices.push(vertex);
    });

    this.mesh.triangles.forEach((triangle: number[]): void => {
      const face = new Face3(triangle[0], triangle[1], triangle[2]);
      geometry.faces.push(face);
    });

    const ab = new Vector3();
    let cb = new Vector3();
    geometry.faces.forEach((triangle: THREE.Face3): void => {
      const vA = geometry.vertices[triangle.a];
      const vB = geometry.vertices[triangle.b];
      const vC = geometry.vertices[triangle.c];
      cb.subVectors(vC, vB);
      ab.subVectors(vA, vB);
      cb = cb.cross(ab);
      cb.normalize();
      triangle.normal.copy(cb);
    });

    geometry.verticesNeedUpdate = true;
    geometry.elementsNeedUpdate = true;
    geometry.normalsNeedUpdate = true;

    geometry.computeBoundingBox();

    return geometry;
  }

  private show() {
    const geometry = this.createGeometry();
    animation.update(geometry, this.resolution);
  }
}

function setStatus(value: string) {
  document.getElementById("status")!.innerText = value;
}

export default Shape;
