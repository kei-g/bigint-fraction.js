/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { Euclidian } from './euclidian'

/**
 * fraction
 */
export class Fraction implements FractionLike, Reducible {
  /**
   * internal denominator
   * @type {bigint}
   */
  private _denominator: bigint

  /**
   * internal irreducible state
   * this value won't be defined until either reduce or reduceAsync is called
   * @type {boolean | undefined}
   */
  private _irreducible?: boolean

  /**
   * internal numerator
   * @type {bigint}
   */
  private _numerator: bigint

  /**
   * construct an instance of fraction
   * @param {Fraction | FractionLike | bigint | number} valueOrNumerator fraction or numerator
   * @param {bigint | number} denominator denominator if 'valueOrNumerator' is not fraction, and default to 1
   */
  constructor(
    valueOrNumerator?: FractionLike | Integer,
    denominator?: Integer,
  ) {
    const f = valueOrNumerator
    if (f instanceof Fraction) {
      if (typeof f._irreducible === 'boolean')
        this._irreducible = f._irreducible
      this._denominator = f._denominator
      this._numerator = f._numerator
    }
    else if (isFractionLike(f)) {
      this._denominator = f.denominator
      this._numerator = f.numerator
    }
    else {
      const numerator = f
      if (typeof numerator === 'undefined'
        || numerator === null) {
        this._denominator = 1n
        this._numerator = 0n
      }
      else if (typeof denominator === 'undefined'
        || denominator === null) {
        this._denominator = 1n
        this._numerator = BigInt(numerator)
      }
      else {
        this._denominator = BigInt(denominator)
        this._numerator = BigInt(numerator)
      }
    }
  }

  /**
   * add a fraction to this fraction
   * @param {Fraction | FractionLike | bigint | number} valueOrNumerator fraction or numerator
   * @param {bigint | number} denominator denominator if 'valueOrNumerator' is not fraction, and default to 1
   */
  add(
    valueOrNumerator: FractionLike | Integer,
    denominator?: Integer,
  ): void {
    const f = valueOrNumerator
    if (isFractionLike(f)) {
      const gcd = Euclidian.GCD(this._denominator, f.denominator)
      const lcm = this._denominator * f.denominator / gcd
      const lhs = this._numerator * f.denominator / gcd
      const rhs = this._denominator * f.numerator / gcd
      delete this._irreducible
      this._denominator = lcm
      this._numerator = lhs + rhs
    }
    else {
      const numerator = f
      switch (typeof denominator) {
        case 'bigint':
          this.add({
            denominator,
            numerator: BigInt(numerator)
          })
          break
        case 'number':
          this.add({
            denominator: BigInt(denominator),
            numerator: BigInt(numerator),
          })
          break
        case 'undefined':
          this.add({
            denominator: 1n,
            numerator: BigInt(numerator),
          })
          break
        default:
          throw new Error('illegal denominator type')
      }
    }
  }

  /**
   * asynchronously add a fraction to this fraction
   * @param {Fraction | FractionLike | bigint | number} valueOrNumerator fraction or numerator
   * @param {bigint | number} denominator denominator if 'valueOrNumerator' is not fraction, and default to 1
   * @returns {Promise<void>} promise
   */
  async addAsync(
    valueOrNumerator: FractionLike | Integer,
    denominator?: Integer,
  ): Promise<void> {
    const f = valueOrNumerator
    if (isFractionLike(f)) {
      const gcd = await Euclidian.GCDAsync(this._denominator, f.denominator)
      const [lcm, lhs, rhs] = await Promise.all([
        { a: this._denominator, b: f.denominator },
        { a: this._numerator, b: f.denominator },
        { a: this._denominator, b: f.numerator },
      ].map(
        (ctx: { a: bigint, b: bigint }) =>
          new Promise(
            (resolve: (value: bigint) => void) =>
              resolve(ctx.a * ctx.b / gcd)
          )
      ))
      delete this._irreducible
      this._denominator = lcm
      this._numerator = lhs + rhs
    }
    else {
      const numerator = f
      switch (typeof denominator) {
        case 'bigint':
          await this.addAsync({
            denominator,
            numerator: BigInt(numerator)
          })
          break
        case 'number':
          await this.addAsync({
            denominator: BigInt(denominator),
            numerator: BigInt(numerator),
          })
          break
        case 'undefined':
          await this.addAsync({
            denominator: 1n,
            numerator: BigInt(numerator),
          })
          break
        default:
          await Promise.reject(new Error('illegal denominator type'))
      }
    }
  }

  /**
   * get a clone of this fraction
   * @returns cloned instance
   */
  clone(): Fraction {
    return new Fraction(this)
  }

  /**
   * denominator
   * @type {bigint}
   */
  get denominator(): bigint {
    return this._denominator
  }

  /**
   * divide this fraction by a fraction
   * @param {Fraction | FractionLike | bigint | number} valueOrNumerator fraction or numerator
   * @param {bigint | number} denominator denominator if 'valueOrNumerator' is not fraction, and default to 1
   */
  divide(
    valueOrNumerator: FractionLike | Integer,
    denominator?: Integer,
  ): void {
    const f = valueOrNumerator
    if (isFractionLike(f))
      this.multiply(new Fraction(f.denominator, f.numerator))
    else {
      const numerator = f
      this.multiply(new Fraction(denominator ?? 1, numerator))
    }
  }

  /**
   * asynchronously divide this fraction by a fraction
   * @param {Fraction | FractionLike | bigint | number} valueOrNumerator fraction or numerator
   * @param {bigint | number} denominator denominator if 'valueOrNumerator' is not fraction, and default to 1
   */
  async divideAsync(
    valueOrNumerator: FractionLike | Integer,
    denominator?: Integer,
  ): Promise<void> {
    const f = valueOrNumerator
    if (isFractionLike(f))
      await this.multiplyAsync(new Fraction(f.denominator, f.numerator))
    else {
      const numerator = f
      await this.multiplyAsync(new Fraction(denominator ?? 1, numerator))
    }
  }

  /**
   * determine whether if this fraction is irreducible
   * @type {boolean}
   */
  get isIrreducible(): boolean {
    if (this._irreducible === undefined) {
      const gcd = Euclidian.GCD(this._denominator, this._numerator)
      this._irreducible = gcd === 1n
    }
    return this._irreducible
  }

  /**
   * multiply a fraction to this fraction
   * @param {Fraction | FractionLike | bigint | number} valueOrNumerator fraction or numerator
   * @param {bigint | number} denominator denominator if 'valueOrNumerator' is not fraction, and default to 1
   */
  multiply(
    valueOrNumerator: FractionLike | Integer,
    denominator?: Integer,
  ): void {
    const f = valueOrNumerator
    if (isFractionLike(f)) {
      delete this._irreducible
      this._denominator *= f.denominator
      this._numerator *= f.numerator
    }
    else {
      const numerator = BigInt(f)
      switch (typeof denominator) {
        case 'bigint':
          delete this._irreducible
          this._denominator *= denominator
          this._numerator *= numerator
          break
        case 'number':
          delete this._irreducible
          this._denominator *= BigInt(denominator)
          this._numerator *= numerator
          break
        case 'undefined':
          delete this._irreducible
          this._numerator *= numerator
          break
        default:
          throw new Error('illegal denominator type')
      }
    }
  }

  /**
   * asynchronously multiply a fraction to this fraction
   * @param {Fraction | FractionLike | bigint | number} valueOrNumerator fraction or numerator
   * @param {bigint | number} denominator denominator if 'valueOrNumerator' is not fraction, and default to 1
   * @returns {Promise<void>} promise
   */
  async multiplyAsync(
    valueOrNumerator: FractionLike | Integer,
    denominator?: Integer,
  ): Promise<void> {
    const f = valueOrNumerator
    if (isFractionLike(f)) {
      delete this._irreducible
      const [d, n] = await Promise.all([
        { a: this._denominator, b: f.denominator },
        { a: this._numerator, b: f.numerator }
      ].map(
        (ctx: { a: bigint, b: bigint }) =>
          new Promise(
            (resolve: (value: bigint) => void) =>
              resolve(ctx.a * ctx.b)
          )
      ))
      this._denominator = d
      this._numerator = n
    }
    else {
      const numerator = BigInt(f)
      switch (typeof denominator) {
        case 'bigint':
        case 'number':
          await this.multiplyAsync(
            new Fraction(numerator, denominator)
          )
          break
        case 'undefined':
          delete this._irreducible
          this._numerator *= numerator
          await Promise.resolve()
          break
        default:
          await Promise.reject(new Error('illegal denominator type'))
      }
    }
  }

  /**
   * numerator
   * @type {bigint}
   */
  get numerator(): bigint {
    return this._numerator
  }

  /**
   * divide `denominator` and `numerator`
   * by a greatest common divisor between them
   * @param cb callback function which takes a greatest common divisor
   * @returns a value from callback function if reducible,
   * otherwise, the instance of Irreducible
   */
  reduce<T>(
    cb?: (gcd: bigint) => T,
  ): Irreducible | T {
    const gcd = Euclidian.GCD(this._denominator, this._numerator)
    if (!gcd || gcd === 1n) {
      this._irreducible = true
      return Irreducible.TheInstance
    }
    delete this._irreducible
    const result = cb ? cb(gcd) : undefined
    this._irreducible = true
    this._denominator /= gcd
    this._numerator /= gcd
    return result
  }

  /**
   * asynchronously divide `denominator` and `numerator`
   * by a greatest common divisor between them
   * @param cb callback function which takes a greatest common divisor
   * @returns a value from callback function if reducible,
   * otherwise, the instance of Irreducible
   */
  async reduceAsync<T>(
    cb: ReduceAsyncCallback<T>,
  ): Promise<Irreducible | T> {
    const gcd = await Euclidian.GCDAsync(this._denominator, this._numerator)
    if (!gcd || gcd === 1n) {
      this._irreducible = true
      return Promise.resolve(Irreducible.TheInstance)
    }
    delete this._irreducible
    const [result] = await Promise.all([
      cb(gcd),
      new Promise(
        (resolve: (value: bigint) => void) =>
          resolve(this._denominator /= gcd)
      ),
      new Promise(
        (resolve: (value: bigint) => void) =>
          resolve(this._numerator /= gcd)
      ),
    ])
    this._irreducible = true
    return result
  }

  /**
   * subtract a fraction from this fraction
   * @param {Fraction | FractionLike | bigint | number} valueOrNumerator fraction or numerator
   * @param {bigint | number} denominator denominator if 'valueOrNumerator' is not fraction, and default to 1
   */
  subtract(
    valueOrNumerator: FractionLike | Integer,
    denominator?: Integer,
  ): void {
    const f = valueOrNumerator
    if (isFractionLike(f)) {
      const c = f instanceof Fraction ? f.clone() : new Fraction(f)
      c._numerator = -c._numerator
      this.add(c)
    }
    else {
      const numerator = f
      this.add(-numerator, denominator)
    }
  }

  /**
   * asynchronously subtract a fraction from this fraction
   * @param {Fraction | FractionLike | bigint | number} valueOrNumerator fraction or numerator
   * @param {bigint | number} denominator denominator if 'valueOrNumerator' is not fraction, and default to 1
   * @returns {Promise<void>} promise
   */
  async subtractAsync(
    valueOrNumerator: FractionLike | Integer,
    denominator?: Integer,
  ): Promise<void> {
    const f = valueOrNumerator
    if (isFractionLike(f)) {
      const c = f instanceof Fraction ? f.clone() : new Fraction(f)
      c._numerator = -c._numerator
      await this.addAsync(c)
    }
    else {
      const numerator = f
      await this.addAsync(-numerator, denominator)
    }
  }
}

/**
 * fraction-like type
 */
export type FractionLike = {
  /**
   * denominator
   * @type {bigint}
   */
  denominator: bigint

  /**
   * numerator
   * @type {bigint}
   */
  numerator: bigint
}

/**
 * integer type
 */
export type Integer = bigint | number

/**
 * irreducible
 */
export class Irreducible implements Reducible {
  /**
   * the singleton of Irreducible class
   * @type {Irreducible}
   */
  static readonly TheInstance: Reducible = new Irreducible()

  /**
   * internal constructor, never used externally
   */
  private constructor() {
  }

  /**
   * always true
   * @type {boolean}
   */
  get isIrreducible(): boolean {
    return true
  }

  /**
   * do nothing
   * @param cb callback function, but never called
   * @returns the instance of Irreducible
   */
  reduce<T>(
    cb?: (gcd: bigint) => T,
  ): Irreducible | T {
    return Irreducible.TheInstance
  }

  /**
   * do nothing
   * @param cb callback function, but never called
   * @returns the instance of Irreducible
   */
  reduceAsync<T>(
    cb: ReduceAsyncCallback<T>,
  ): Promise<Irreducible | T> {
    return Promise.resolve(Irreducible.TheInstance)
  }
}

/**
 * callback function type for Reducible#reduceAsync
 */
type ReduceAsyncCallback<T> =
  (gcd: bigint) => PromiseLike<T> | T

/**
 * reducible interface
 */
export interface Reducible {
  /**
   * determine whether if the fraction is irreducible
   * @type {boolean}
   */
  get isIrreducible(): boolean

  /**
   * divide `denominator` and `numerator`
   * by a greatest common divisor between them
   * @param cb callback function which takes a greatest common divisor
   * @returns a value from callback function if reducible,
   * otherwise, the instance of Irreducible
   */
  reduce<T>(
    cb?: (gcd: bigint) => T,
  ): Irreducible | T

  /**
   * asynchronously divide `denominator` and `numerator`
   * by a greatest common divisor between them
   * @param cb callback function which takes a greatest common divisor
   * @returns a value from callback function if reducible,
   * otherwise, the instance of Irreducible
   */
  reduceAsync<T>(
    cb: ReduceAsyncCallback<T>,
  ): Promise<Irreducible | T>
}

/**
 * determines whether if does a value like to fraction
 * @param {unknown} value target value to be determined
 * @returns type-guard specifier for FractionLike
 */
export const isFractionLike =
  (value: unknown): value is FractionLike => {
    if (!value)
      return false
    const frac = value as FractionLike
    return typeof frac.denominator === 'bigint'
      && typeof frac.numerator === 'bigint'
  }

Object.freeze(Irreducible.TheInstance)
