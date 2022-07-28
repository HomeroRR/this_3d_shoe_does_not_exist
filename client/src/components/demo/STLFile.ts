interface ShapeMesh {
  vertices: number[][];
  triangles: number[][];
}

function writeVector(view: DataView, offset: number, vector: number[]): void {
  view.setFloat32(offset, vector[2], true);
  view.setFloat32(offset + 4, vector[0], true);
  view.setFloat32(offset + 8, vector[1], true);
}

class STLFile {
  static create(mesh: ShapeMesh): ArrayBuffer {
    const size: number = 84 + 50 * mesh.triangles.length;
    const buffer = new ArrayBuffer(size);
    const view = new DataView(buffer, 0, size);

    for (let i = 0; i < 80; i++) view.setInt8(i, 0);

    let p: number = 80;
    view.setInt32(p, mesh.triangles.length, true);
    p += 4;

    for (const triangle of mesh.triangles) {
      writeVector(view, p, [1, 0, 0]); // normal
      writeVector(view, p + 12, mesh.vertices[triangle[0]]);
      writeVector(view, p + 24, mesh.vertices[triangle[1]]);
      writeVector(view, p + 36, mesh.vertices[triangle[2]]);
      view.setInt16(p + 48, 0, true);
      p += 50;
    }

    return buffer;
  }
}

export default STLFile;
