import Shape, { onnxSession } from "./Shape";
import LatentCode from "./LatentCode";
import type EventBus from "services/bus/EventBus";

interface GanGenParams {
  seed: number | null;
  resolution: number;
  latentCode: Float32Array | null;
  latentCodeScalingFactor: number;
  level: number;
}

const GAN_MODEL_URI = "shoes.onnx";
const DEFAULT_PARAMETERS = Object.freeze({
  seed: null,
  resolution: 24,
  latentCode: null,
  latentCodeScalingFactor: 1,
  level: 0.04,
});

class Display {
  public static eventBus: EventBus = Shape.eventBus;
  public parameters: GanGenParams = { ...DEFAULT_PARAMETERS };
  public currentShape: Shape | null = null;
  public canvas: HTMLCanvasElement | null = null;
  constructor() {
    onnxSession.loadModel(GAN_MODEL_URI).then(() => {
      if (this.parameters.latentCode != null) this.updateShape();
      else this.generateShape();
    });
  }
  public updateShape(): void {
    if (Shape?.isGenerating) return;
    if (!this.parameters.latentCode) return;
    if (!this.canvas) return;
    this.currentShape = new Shape(
      this.parameters.latentCode,
      this.parameters.resolution,
      this.parameters.latentCodeScalingFactor,
      this.parameters.level,
      this.canvas
    );
    this.currentShape.generate();
  }
  public generateShape(): void {
    this.parameters.seed = Math.floor(Math.random() * 4294967295);
    this.parameters.latentCode = LatentCode.getRandom(this.parameters.seed);
    this.updateShape();
  }
}

export default Display;
