import { Euclidean } from '../src/index'
import { describe, it } from 'mocha'
import { expect } from 'chai'

describe('euclidean', () => {
  it('async gcd(11, 0)', async () =>
    expect(await Euclidean.GCDAsync(11n, 0n)).to.eq(0n)
  )
  it('async gcd(12, 15)', async () =>
    expect(await Euclidean.GCDAsync(12n, 15n)).to.eq(3n)
  )
  it('async gcd(1, -1) === 1', async () =>
    expect(await Euclidean.GCDAsync(1n, -1n)).to.eq(1n)
  )
  it('gcd(6, 9) === 3', () =>
    expect(Euclidean.GCD(6n, 9n)).to.eq(3n)
  )
  it('gcd(-30, 105) === 15', () =>
    expect(Euclidean.GCD(-30n, 105n)).to.eq(15n)
  )
  it('gcd(1, -1) === 1', () =>
    expect(Euclidean.GCD(1n, -1n)).to.eq(1n)
  )
  it('gcd(0, 0) === 0', () =>
    expect(Euclidean.GCD(0n, 0n)).to.eq(0n)
  )
})
