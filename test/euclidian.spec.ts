import { Euclidean } from '../src/index'
import { describe, it } from 'mocha'
import { equal } from 'node:assert'

describe('euclidean', () => {
  it('async gcd(11, 0)', async () =>
    equal(await Euclidean.GCDAsync(11n, 0n), 0n)
  )
  it('async gcd(12, 15)', async () =>
    equal(await Euclidean.GCDAsync(12n, 15n), 3n)
  )
  it('async gcd(1, -1) === 1', async () =>
    equal(await Euclidean.GCDAsync(1n, -1n), 1n)
  )
  it('gcd(6, 9) === 3', () =>
    equal(Euclidean.GCD(6n, 9n), 3n)
  )
  it('gcd(-30, 105) === 15', () =>
    equal(Euclidean.GCD(-30n, 105n), 15n)
  )
  it('gcd(1, -1) === 1', () =>
    equal(Euclidean.GCD(1n, -1n), 1n)
  )
  it('gcd(0, 0) === 0', () =>
    equal(Euclidean.GCD(0n, 0n), 0n)
  )
})
