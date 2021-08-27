/* eslint-disable @typescript-eslint/no-namespace */

/**
 * bigint utilities
 */
namespace BigInt {
  /**
   * get absolute value
   * @param value target big integer
   * @returns absolute value of target big integer
   */
  export const abs =
    (value: bigint): bigint =>
      value < 0n ? -value : value
}

/**
 * euclidian utilities
 */
export namespace Euclidian {
  /**
   * compute a greatest common divisor between two arguments
   * @param a first argument
   * @param b second argument
   * @returns a greatest common divisor of `a` and `b`
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
}
