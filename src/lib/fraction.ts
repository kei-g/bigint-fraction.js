import { Euclidean } from './euclidean'

/**
 * Fractional number class.
 *
 * @implements {FractionLike}
 * @implements {Reducible}
 */
export class Fraction implements FractionLike, Reducible {
  /**
   * Internal integer as denominator.
   *
   * @type {bigint}
   */
  private _denominator: bigint

  /**
   * Internal irreducible state.
   * This value won't be defined until
   * either reduce or reduceAsync is called.
   *
   * @type {boolean | undefined}
   */
  private _irreducible?: boolean

  /**
   * Internal integer as numerator.
   *
   * @type {bigint}
   */
  private _numerator: bigint

  /**
   * Constructs an instance of the fractional number class.
   *
   * @param {Fraction | FractionLike | bigint | number} valueOrNumerator
   *
   * Either an object or an integer.
   *
   * If an object which contains numerator and denominator as the keys
   * is specified, they will be copied to the new object. In this case,
   * only the first one would be used no matter what the second argument.
   *
   * If an integer is specified, it and the second argument will become
   * the numerator and the denominator of the new object.
   *
   * If this argument is omitted, the new object would be a zero.
   *
   * @param {bigint | number} denominator
   *
   * The denominator of the new fractional number object.
   *
   * If this argument is omitted, the new object would be just an integer.
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
   * Increases the value of this object.
   *
   * @param {Fraction | FractionLike | bigint | number} valueOrNumerator
   *
   * Either an object or an integer.
   *
   * If an object which has 'numerator' and 'denominator' as the keys
   * is specified, their values will be used to increase the value of
   * this object. In this case, only the first one will be used no matter
   * what the second argument.
   *
   * If an integer is specified, it and the second argument will be used
   * as the numerator and the denominator to increase the value of this
   * object.
   *
   * This argument must not be omitted.
   *
   * @param {bigint | number} denominator
   *
   * An integer used as denominator to increase the value of this object.
   *
   * If this argument is omitted, the denominator will be interpreted as 1.
   */
  add(
    valueOrNumerator: FractionLike | Integer,
    denominator?: Integer,
  ): void {
    const f = valueOrNumerator
    if (isFractionLike(f)) {
      const gcd = Euclidean.GCD(this._denominator, f.denominator)
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
   * Increases the value of this object asynchronously.
   *
   * @param {Fraction | FractionLike | bigint | number} valueOrNumerator
   *
   * Either an object or an integer.
   *
   * If an object which has 'numerator' and 'denominator' as the keys
   * is specified, their values will be used to increase the value of
   * this object. In this case, only the first one will be used no matter
   * what the second argument.
   *
   * If an integer is specified, it and the second argument will be used
   * as the numerator and the denominator to increase the value of this
   * object.
   *
   * This argument must not be omitted.
   *
   * @param {bigint | number} denominator
   *
   * An integer used as denominator to increase the value of this object.
   *
   * If this argument is omitted, the denominator will be interpreted as 1.
   *
   * @returns {Promise<void>}
   *
   * A promise.
   */
  async addAsync(
    valueOrNumerator: FractionLike | Integer,
    denominator?: Integer,
  ): Promise<void> {
    const f = valueOrNumerator
    if (isFractionLike(f)) {
      const gcd = await Euclidean.GCDAsync(this._denominator, f.denominator)
      const [lcm, lhs, rhs] = await callProceduresConcurrentlyAsync(
        () => this._denominator * f.denominator / gcd,
        () => this._numerator * f.denominator / gcd,
        () => this._denominator * f.numerator / gcd,
      )
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
   * Creates a clone of this object.
   *
   * @returns {Fraction}
   *
   * Created object.
   */
  clone(): Fraction {
    return new Fraction(this)
  }

  /**
   * Returns the denominator of this object.
   *
   * @type {bigint}
   */
  get denominator(): bigint {
    return this._denominator
  }

  /**
   * Divides the value of this object.
   *
   * @param {Fraction | FractionLike | bigint | number} valueOrNumerator
   *
   *
   * @param {bigint | number} denominator
   *
   *
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
   * Divides the value of this object asynchronously.
   *
   * @param {Fraction | FractionLike | bigint | number} valueOrNumerator
   *
   *
   * @param {bigint | number} denominator
   *
   *
   * @returns {Promise<void>}
   *
   * A promise.
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
   * Determines whether if the value of this object is irreducible or not.
   *
   * @type {boolean}
   */
  get isIrreducible(): boolean {
    if (this._irreducible === undefined) {
      const gcd = Euclidean.GCD(this._denominator, this._numerator)
      this._irreducible = gcd === 1n
    }
    return this._irreducible
  }

  /**
   * Multiplys the value of this object.
   *
   * @param {Fraction | FractionLike | bigint | number} valueOrNumerator
   *
   *
   * @param {bigint | number} denominator
   *
   *
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
   * Multiplys the value of this object asynchronously.
   *
   * @param {Fraction | FractionLike | bigint | number} valueOrNumerator
   *
   *
   * @param {bigint | number} denominator
   *
   *
   * @returns {Promise<void>}
   *
   * A promise.
   */
  async multiplyAsync(
    valueOrNumerator: FractionLike | Integer,
    denominator?: Integer,
  ): Promise<void> {
    const f = valueOrNumerator
    if (isFractionLike(f)) {
      delete this._irreducible
      const [d, n] = await callProceduresConcurrentlyAsync(
        () => this._denominator * f.denominator,
        () => this._numerator * f.numerator,
      )
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
   * Returns the numerator of this object.
   *
   * @type {bigint}
   */
  get numerator(): bigint {
    return this._numerator
  }

  /**
   * Makes this object irreducible.
   *
   * @param {Function} cb
   *
   * Callback function which takes a greatest common divisor.
   *
   * @returns {Irreducible | T}
   *
   * If this is already irreducible, the instance of Irreducible class
   * will be returned. Otherwise, the value returned by the callback
   * function will be returned.
   */
  reduce<T>(
    cb?: (gcd: bigint) => T,
  ): Irreducible | T {
    const gcd = Euclidean.GCD(this._denominator, this._numerator)
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
   * Makes this object irreducible asynchronously.
   *
   * @param {Function} cb
   *
   * Callback function which takes a greatest common divisor.
   *
   * @returns {Promise<Irreducible | T>}
   *
   * A promise.
   */
  async reduceAsync<T>(
    cb: ReduceAsyncCallback<T>,
  ): Promise<Irreducible | T> {
    const gcd = await Euclidean.GCDAsync(this._denominator, this._numerator)
    if (!gcd || gcd === 1n) {
      this._irreducible = true
      return Promise.resolve(Irreducible.TheInstance)
    }
    delete this._irreducible
    const [result] = await callProceduresConcurrentlyAsync(
      () => cb(gcd),
      () => (this._denominator /= gcd) as unknown as T,
      () => (this._numerator /= gcd) as unknown as T,
    )
    this._irreducible = true
    return result
  }

  /**
   * Decrease the value of this object.
   *
   * @param {Fraction | FractionLike | bigint | number} valueOrNumerator
   *
   *
   * @param {bigint | number} denominator
   *
   *
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
   * Decrease the value of this object asynchronously.
   *
   * @param {Fraction | FractionLike | bigint | number} valueOrNumerator
   *
   *
   * @param {bigint | number} denominator
   *
   *
   * @returns {Promise<void>}
   *
   * A promise.
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
 * A couple of 'bigint' which composes the fractional number.
 */
export type FractionLike = {
  /**
   * An integer of denominator.
   *
   * @type {bigint}
   */
  denominator: bigint

  /**
   * An integer of numerator.
   *
   * @type {bigint}
   */
  numerator: bigint
}

/**
 * Integer.
 */
export type Integer = bigint | number

/**
 * Irreducible class.
 *
 * @implements {Reducible}
 */
export class Irreducible implements Reducible {
  /**
   * The sole instance of Irreducible class.
   *
   * @type {Irreducible}
   */
  static readonly TheInstance: Reducible = new Irreducible()

  /**
   * Constructs an object of Irreducible class.
   * This is never used externally.
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
  }

  /**
   * Always true.
   *
   * @type {boolean}
   */
  get isIrreducible(): boolean {
    return true
  }

  /**
   * Does nothing.
   *
   * @param {Function} cb
   *
   * A callback function, but never called
   *
   * @returns
   *
   * The sole instance of Irreducible class.
   */
  reduce<T>(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    cb?: (gcd: bigint) => T,
  ): Irreducible | T {
    return Irreducible.TheInstance
  }

  /**
   * Does nothing.
   *
   * @param {Function} cb
   *
   * A callback function, but never called
   *
   * @returns
   *
   * The sole instance of Irreducible class
   */
  reduceAsync<T>(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    cb: ReduceAsyncCallback<T>,
  ): Promise<Irreducible | T> {
    return Promise.resolve(Irreducible.TheInstance)
  }
}

/**
 * Callback function type for Reducible#reduceAsync.
 */
type ReduceAsyncCallback<T> =
  (gcd: bigint) => PromiseLike<T> | T

/**
 * Reducible interface.
 */
export interface Reducible {
  /**
   * Determines whether if the value of this object is irreducible or not.
   *
   * @type {boolean}
   */
  get isIrreducible(): boolean

  /**
   * Makes this object irreducible.
   *
   * @param {Function} cb
   *
   * Callback function which takes a greatest common divisor.
   *
   * @returns {Irreducible | T}
   *
   * If this is already irreducible, the instance of Irreducible class
   * will be returned. Otherwise, the value returned by the callback
   * function will be returned.
   */
  reduce<T>(
    cb?: (gcd: bigint) => T,
  ): Irreducible | T

  /**
   * Makes this object irreducible asynchronously.
   *
   * @param {Function} cb
   *
   * Callback function which takes a greatest common divisor.
   *
   * @returns {Irreducible | T}
   *
   * If this is already irreducible, the instance of Irreducible class
   * will be returned. Otherwise, the value returned by the callback
   * function will be returned.
   */
  reduceAsync<T>(
    cb: ReduceAsyncCallback<T>,
  ): Promise<Irreducible | T>
}

/**
 * Call procedures concurrently.
 *
 * @param {Function[]} procedures
 *
 * An array of procedures.
 *
 * @returns {Promise<T[]>}
 *
 * A promise.
 */
export const callProceduresConcurrentlyAsync =
  <T>(
    ...procedures: (() => T)[]
  ): Promise<T[]> =>
    Promise.all(
      procedures.map(
        (
          procedure: () => T,
        ) =>
          new Promise(
            (
              resolve: (value: T) => void
            ) =>
              setImmediate(
                () =>
                  resolve(procedure())
              )
          )
      )
    )

/**
 * Determines whether if a value is similar to the fraction class.
 *
 * @param {unknown} value
 *
 * A target value to be determined.
 *
 * @returns {boolean}
 *
 * Type-guard-specifier for FractionLike.
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
