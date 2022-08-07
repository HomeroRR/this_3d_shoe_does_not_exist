import { Tensor } from "onnxjs";

const BATCH_SIZE = 4096;
const gridCache: { [key: number]: Tensor[] } = {};

function getGrid(resolution: number): Tensor[] {
  if (resolution in gridCache) return gridCache[resolution];

  const result: Tensor[] = [];
  let currentBatch: Float32Array = new Float32Array(BATCH_SIZE * 3);
  let p: number = 0;
  for (let x = 0; x < resolution; x++) {
    for (let y = 0; y < resolution; y++) {
      for (let z = 0; z < resolution; z++) {
        if (p == BATCH_SIZE * 3) {
          p = 0;
          result.push(new Tensor(currentBatch, "float32", [BATCH_SIZE, 3]));
          currentBatch = new Float32Array(BATCH_SIZE * 3);
        }
        currentBatch[p + 0] = -1 + (2 * x) / (resolution - 1);
        currentBatch[p + 1] = -1 + (2 * y) / (resolution - 1);
        currentBatch[p + 2] = -1 + (2 * z) / (resolution - 1);
        p += 3;
      }
    }
  }
  result.push(new Tensor(currentBatch, "float32", [BATCH_SIZE, 3]));
  gridCache[resolution] = result;
  return result;
}

export default getGrid;
