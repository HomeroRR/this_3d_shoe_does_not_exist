// https://filosophy.org/code/normal-distributed-random-values-in-javascript-using-the-ziggurat-algorithm/
// https://filosophy.org/code/normal-distributed-random-values-in-javascript-using-the-ziggurat-algorithm/
class Ziggurat {
  private jsr: number = 0;
  private wn: number[] = Array(128);
  private fn: number[] = Array(128);
  private kn: number[] = Array(128);

  constructor(seed: number) {
    this.jsr = seed;
    this.zigset();
  }

  public nextGaussian(): number {
    return this.RNOR();
  }

  private RNOR(): number {
    const hz: number = this.SHR3();
    const iz: number = hz & 127;
    return Math.abs(hz) < this.kn[iz] ? hz * this.wn[iz] : this.nfix(hz, iz);
  }

  private nfix(hz: number, iz: number): number {
    const r = 3.442619855899;
    const r1 = 1.0 / r;
    let x;
    let y;
    while (true) {
      x = hz * this.wn[iz];
      if (iz == 0) {
        x = -Math.log(this.UNI()) * r1;
        y = -Math.log(this.UNI());
        while (y + y < x * x) {
          x = -Math.log(this.UNI()) * r1;
          y = -Math.log(this.UNI());
        }
        return hz > 0 ? r + x : -r - x;
      }

      if (
        this.fn[iz] + this.UNI() * (this.fn[iz - 1] - this.fn[iz]) <
        Math.exp(-0.5 * x * x)
      ) {
        return x;
      }
      hz = this.SHR3();
      iz = hz & 127;

      if (Math.abs(hz) < this.kn[iz]) {
        return hz * this.wn[iz];
      }
    }
  }

  private SHR3(): number {
    const jz = this.jsr;
    let jzr = this.jsr;
    jzr ^= jzr << 13;
    jzr ^= jzr >>> 17;
    jzr ^= jzr << 5;
    this.jsr = jzr;
    return (jz + jzr) | 0;
  }

  private UNI(): number {
    return 0.5 * (1 + this.SHR3() / -Math.pow(2, 31));
  }

  private zigset(): void {
    const m1 = 2147483648.0;
    const vn = 9.91256303526217e-3;
    let dn: number = 3.442619855899;
    let tn: number = dn;
    let q: number = vn / Math.exp(-0.5 * dn * dn);

    this.kn[0] = Math.floor((dn / q) * m1);
    this.kn[1] = 0;

    this.wn[0] = q / m1;
    this.wn[127] = dn / m1;

    this.fn[0] = 1.0;
    this.fn[127] = Math.exp(-0.5 * dn * dn);

    for (var i = 126; i >= 1; i--) {
      dn = Math.sqrt(-2.0 * Math.log(vn / dn + Math.exp(-0.5 * dn * dn)));
      this.kn[i + 1] = Math.floor((dn / tn) * m1);
      tn = dn;
      this.fn[i] = Math.exp(-0.5 * dn * dn);
      this.wn[i] = dn / m1;
    }
  }
}

export default Ziggurat;