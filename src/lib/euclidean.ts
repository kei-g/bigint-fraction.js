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
      value < 0 ? -value : value
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
    if (!a || !b)
      return 0n
    if (a === b)
      return a
    const m = BigInt.abs(a)
    const n = BigInt.abs(b)
    if (m < n)
      return compute(n, m)
    else if (m === n)
      return m
    else
      return compute(m, n)
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
      !a || !b
        ? Promise.resolve(0n)
        : a === b
          ? Promise.resolve(a)
          : new Promise(
            (
              resolve: (value: bigint) => void
            ) => {
              const m = BigInt.abs(a)
              const n = BigInt.abs(b)
              if (m < n)
                computeLazily(n, m, resolve)
              else if (m === n)
                resolve(m)
              else
                computeLazily(m, n, resolve)
            }
          )
}

const compute =
  (
    greater: bigint,
    lesser: bigint,
  ): bigint => {
    for (; ;) {
      const r = greater % lesser
      if (!r)
        return lesser
      greater = lesser
      lesser = r
    }
  }

const computeLazily =
  (
    greater: bigint,
    lesser: bigint,
    resolve: (gcf: bigint) => void,
  ): void => {
    const r = greater % lesser
    if (r)
      setImmediate(computeLazily, lesser, r, resolve)
    else
      resolve(lesser)
  }

Object.freeze(compute)
Object.freeze(computeLazily)
