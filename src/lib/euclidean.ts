/* eslint-disable @typescript-eslint/no-namespace */

/**
 * BigInt utilities.
 */
namespace BigInt {
  /**
   * Returns absolute value of the integer.
   *
   * @param {bigint} value
   *
   * An integer.
   *
   * @returns {bigint}
   *
   * Absolute value of specified integer.
   */
  export const abs =
    (value: bigint): bigint =>
      value < 0n ? -value : value
}

/**
 * Euclidean utilities.
 */
export namespace Euclidean {
  /**
   * Computes a greatest common divisor between a pair of integers.
   *
   * @param {bigint} a
   *
   * The first integer.
   *
   * @param {bigint} b
   *
   * The second integer.
   *
   * @returns {bigint}
   *
   * A greatest common divisor of two arguments.
   */
  export const GCD = (a: bigint, b: bigint): bigint => {
    if (a === 0n || b === 0n)
      return 0n
    let [m, n] = [a, b].map(BigInt.abs)
    while (n) {
      const r = m % n
      m = n
      n = r
    }
    return m
  }

  /**
   * Computes a greatest common divisor between a pair of integers asynchronously.
   *
   * @param {bigint} a
   *
   * The first integer.
   *
   * @param {bigint} b
   *
   * The second integer.
   *
   * @returns {Promise<bigint>}
   *
   * A promise.
   */
  export const GCDAsync =
    (a: bigint, b: bigint): Promise<bigint> =>
      a === 0n || b === 0n
        ? Promise.resolve(0n)
        : new Promise(
          (
            resolve: (value: bigint) => void
          ) =>
            setImmediate(
              () => {
                let [m, n] = [a, b].map(BigInt.abs)
                while (n) {
                  const r = m % n
                  m = n
                  n = r
                }
                resolve(m)
              }
            )
        )
}
