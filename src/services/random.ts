type RandomState = [number, number];

class Random {
  _state: RandomState;

  /**
   * Initalise the generator with a specific state - useful for loading up from a previously saved state.
   */
  constructor(state: RandomState);
  /**
   * Seed the generator with two numbers.
   * They should be 32-bit integers and cannot both be zero.
   */
  constructor(seedA: number, seedB: number);
  constructor(seedA: RandomState | number, seedB?: number) {
    if (Array.isArray(seedA)) {
      this._state = seedA;
    } else {
      this._state = [seedA >>> 0, seedB! >>> 0];
      this.next();
    }
  }

  /**
   * Returns current state of the generator.
   */
  getState() {
    return [...this._state];
  }

  /**
   * Returns a random number between greater than or equal to 0 and less than 1.
   */
  next(): number {
    // xoshiro64** PRNG algorithm
    // (https://prng.di.unimi.it/xoroshiro64starstar.c)

    const rotl = (x: number, k: number) => (x << k) | (x >>> (32 - k));

    const s0 = this._state[0];
    let s1 = this._state[1];
    const result = Math.imul(rotl(Math.imul(s0, 0x9e3779bb), 5), 5);

    s1 ^= s0;
    this._state[0] = rotl(s0, 26) ^ s1 ^ (s1 << 9);
    this._state[1] = rotl(s1, 13);

    return (result >>> 0) / (0xffffffff + 1);
  }

  /**
   * Returns a random number between greater than or equal to `min` and less than `max`.
   */
  nextInt(min: number, max: number) {
    return Math.floor(this.next() * (max - min) + min);
  }

  /**
   * Returns a randomly chosen element of `array`.
   */
  nextElement<T>(array: T[]): T {
    return array[this.nextInt(0, array.length)];
  }

  /**
   * Returns an externally-generated (from `Math.random()`) random number suitable for seeding the generator.
   */
  static randomSeed(): number {
    return Math.floor(Math.random() * 0xffffffff);
  }
}

export default Random;
