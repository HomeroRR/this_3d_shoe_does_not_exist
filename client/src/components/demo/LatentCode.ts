import { Tensor } from "onnxjs";
import Ziggurat from "./Ziggurat";

const LATENT_CODE_SIZE = 128;
const BATCH_SIZE = 4096;

class LatentCode {
  static getRandom(seed: number): Float32Array {
    const normalDistribution = new Ziggurat(seed);
    const values = new Float32Array(LATENT_CODE_SIZE);
    for (let i = 0; i < LATENT_CODE_SIZE; i++)
      values[i] = normalDistribution.nextGaussian();
    return values;
  }
  static createBatch(code: Float32Array, scalingFactor: number = 1): Tensor {
    const result = new Float32Array(LATENT_CODE_SIZE * BATCH_SIZE);
    for (let i = 0; i < BATCH_SIZE; i++) {
      for (let j = 0; j < LATENT_CODE_SIZE; j++) {
        result[i * LATENT_CODE_SIZE + j] = code[j] * scalingFactor;
      }
    }
    return new Tensor(result, "float32", [BATCH_SIZE, LATENT_CODE_SIZE]);
  }
}

export default LatentCode;
