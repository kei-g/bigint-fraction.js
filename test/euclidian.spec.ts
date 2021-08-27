import { Euclidian } from '../src/index'
import { describe, it } from 'mocha'
import { expect } from 'chai'

describe('euclidian', () => {
  it('gcd(6, 9) === 3', () =>
    expect(Euclidian.GCD(6n, 9n)).to.eq(3n)
  )
  it('gcd(-30, 105) === 15', () =>
    expect(Euclidian.GCD(-30n, 105n)).to.eq(15n)
  )
  it('gcd(0, 0) === 0', () =>
    expect(Euclidian.GCD(0n, 0n)).to.eq(0n)
  )
})
