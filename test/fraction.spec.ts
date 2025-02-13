import { Fraction, Irreducible } from '../src/index'
import { describe, it } from 'mocha'
import { expect } from 'chai'

describe('add', () => {
  it('0 + 1 = 1', () => {
    const a = new Fraction()
    expect(a.denominator).to.eq(1n)
    expect(a.numerator).to.eq(0n)
    a.add(1)
    expect(a.denominator).to.eq(1n)
    expect(a.numerator).to.eq(1n)
  })
  it('1/2 + 1/3 = 5/6', () => {
    const a = new Fraction(1, 2)
    expect(a.denominator).to.eq(2n)
    expect(a.numerator).to.eq(1n)
    a.add(1, 3)
    expect(a.denominator).to.eq(6n)
    expect(a.numerator).to.eq(5n)
  })
  it('1/2 + 1/3n = 5/6', () => {
    const a = new Fraction(1, 2)
    expect(a.denominator).to.eq(2n)
    expect(a.numerator).to.eq(1n)
    a.add(1, 3n)
    expect(a.denominator).to.eq(6n)
    expect(a.numerator).to.eq(5n)
  })
  it('0 + 1/\'1\' throws an error', () => {
    const a = new Fraction()
    expect(a.denominator).to.eq(1n)
    expect(a.numerator).to.eq(0n)
    expect(() => a.add(0, '1' as unknown as bigint))
      .to.throw('illegal denominator type')
  })
})

describe('addAsync', () => {
  it('0 + 1 = 1', async () => {
    const a = new Fraction()
    expect(a.denominator).to.eq(1n)
    expect(a.numerator).to.eq(0n)
    await a.addAsync(1)
    expect(a.denominator).to.eq(1n)
    expect(a.numerator).to.eq(1n)
  })
  it('1/2 + 1/3 = 5/6', async () => {
    const a = new Fraction(1, 2)
    expect(a.denominator).to.eq(2n)
    expect(a.numerator).to.eq(1n)
    await a.addAsync(1, 3)
    expect(a.denominator).to.eq(6n)
    expect(a.numerator).to.eq(5n)
  })
  it('1/2 + 1/3n = 5/6', async () => {
    const a = new Fraction(1, 2)
    expect(a.denominator).to.eq(2n)
    expect(a.numerator).to.eq(1n)
    await a.addAsync(1, 3n)
    expect(a.denominator).to.eq(6n)
    expect(a.numerator).to.eq(5n)
  })
  it('0 + 1/\'1\' throws an error', async () => {
    const a = new Fraction()
    expect(a.denominator).to.eq(1n)
    expect(a.numerator).to.eq(0n)
    let caught = false
    await a.addAsync(0, '1' as unknown as bigint)
      .catch((err: unknown) => {
        expect(err).to.be.instanceOf(Error)
        if (err instanceof Error) {
          expect(err.message).to.be.a.string('illegal denominator type')
          caught = true
        }
      })
    expect(caught).to.be.eq(true)
  })
})

describe('constructor', () => {
  it('clone', () => {
    const a = new Fraction()
    expect(a.denominator).to.eq(1n)
    expect(a.numerator).to.eq(0n)
    const b = a.clone()
    expect(b).to.not.eq(a)
    expect(b).to.deep.eq(a)
    expect(b.denominator).to.eq(1n)
    expect(b.numerator).to.eq(0n)
    a.reduce()
    const c = a.clone()
    expect(c).not.to.eq(a)
    expect(c).to.deep.eq(a)
    expect(c.denominator).to.eq(1n)
    expect(c.numerator).to.eq(0n)
  })
  it('like', () => {
    const a = new Fraction({
      denominator: 0n,
      numerator: 1n,
    })
    expect(a.denominator).to.eq(0n)
    expect(a.numerator).to.eq(1n)
  })
  it('null denominator', () => {
    const a = new Fraction(1, null as unknown as undefined)
    expect(a.denominator).to.eq(1n)
    expect(a.numerator).to.eq(1n)
  })
  it('undefined denominator', () => {
    const a = new Fraction(1)
    expect(a.denominator).to.eq(1n)
    expect(a.numerator).to.eq(1n)
  })
})

describe('divide', () => {
  it('1 / 2 = 1/2', () => {
    const a = new Fraction(1)
    expect(a.denominator).to.eq(1n)
    expect(a.numerator).to.eq(1n)
    a.divide(2)
    expect(a.denominator).to.eq(2n)
    expect(a.numerator).to.eq(1n)
  })
  it('1 / 1/2 = 2', () => {
    const a = new Fraction(1)
    expect(a.denominator).to.eq(1n)
    expect(a.numerator).to.eq(1n)
    a.divide(new Fraction(1, 2))
    expect(a.denominator).to.eq(1n)
    expect(a.numerator).to.eq(2n)
  })
})

describe('divideAsync', () => {
  it('1 / 2 = 1/2', async () => {
    const a = new Fraction(1)
    expect(a.denominator).to.eq(1n)
    expect(a.numerator).to.eq(1n)
    await a.divideAsync(2)
    expect(a.denominator).to.eq(2n)
    expect(a.numerator).to.eq(1n)
  })
  it('1 / 1/2 = 2', async () => {
    const a = new Fraction(1)
    expect(a.denominator).to.eq(1n)
    expect(a.numerator).to.eq(1n)
    await a.divideAsync(new Fraction(1, 2))
    expect(a.denominator).to.eq(1n)
    expect(a.numerator).to.eq(2n)
  })
})

describe('isIrreducible', () => {
  const a = new Fraction(5, 3)
  it('5/3 is irreducible', () => {
    expect(a.denominator).to.eq(3n)
    expect(a.numerator).to.eq(5n)
    expect(a.isIrreducible).to.be.eq(true)
  })
  it('call twice', () =>
    expect(a.isIrreducible).to.be.eq(true)
  )
})

describe('multiply', () => {
  it('2 * Fraction(1/2) = 1', () => {
    const a = new Fraction(2)
    expect(a.denominator).to.eq(1n)
    expect(a.numerator).to.eq(2n)
    a.multiply(new Fraction(1, 2))
    expect(a.isIrreducible).to.be.eq(false)
    a.reduce()
    expect(a.denominator).to.eq(1n)
    expect(a.numerator).to.eq(1n)
  })
  it('2 * 1/2 = 1', () => {
    const a = new Fraction(2)
    expect(a.denominator).to.eq(1n)
    expect(a.numerator).to.eq(2n)
    a.multiply(1, 2)
    expect(a.isIrreducible).to.be.eq(false)
    a.reduce()
    expect(a.denominator).to.eq(1n)
    expect(a.numerator).to.eq(1n)
  })
  it('2 * 1/2n = 1', () => {
    const a = new Fraction(2)
    expect(a.denominator).to.eq(1n)
    expect(a.numerator).to.eq(2n)
    a.multiply(1, 2n)
    expect(a.isIrreducible).to.be.eq(false)
    a.reduce()
    expect(a.denominator).to.eq(1n)
    expect(a.numerator).to.eq(1n)
  })
  it('3/5 * 2 = 6/5', () => {
    const a = new Fraction(3, 5)
    expect(a.denominator).to.eq(5n)
    expect(a.numerator).to.eq(3n)
    a.multiply(2)
    expect(a.denominator).to.eq(5n)
    expect(a.numerator).to.eq(6n)
  })
  it('1 * 1/\'1\' throws an error', () => {
    const a = new Fraction(1)
    expect(a.denominator).to.eq(1n)
    expect(a.numerator).to.eq(1n)
    expect(() => a.multiply(1, '1' as unknown as bigint))
      .to.throw('illegal denominator type')
  })
})

describe('multiplyAsync', () => {
  it('2 * Fraction(1/2) = 1', async () => {
    const a = new Fraction(2)
    expect(a.denominator).to.eq(1n)
    expect(a.numerator).to.eq(2n)
    await a.multiplyAsync(new Fraction(1, 2))
    expect(a.isIrreducible).to.be.eq(false)
    await a.reduceAsync((gcd: bigint) => gcd)
    expect(a.denominator).to.eq(1n)
    expect(a.numerator).to.eq(1n)
  })
  it('2 * 1/2 = 1', async () => {
    const a = new Fraction(2)
    expect(a.denominator).to.eq(1n)
    expect(a.numerator).to.eq(2n)
    await a.multiplyAsync(1, 2)
    expect(a.isIrreducible).to.be.eq(false)
    await a.reduceAsync((gcd: bigint) => gcd)
    expect(a.denominator).to.eq(1n)
    expect(a.numerator).to.eq(1n)
  })
  it('2 * 1/2n = 1', async () => {
    const a = new Fraction(2)
    expect(a.denominator).to.eq(1n)
    expect(a.numerator).to.eq(2n)
    await a.multiplyAsync(1, 2n)
    expect(a.isIrreducible).to.be.eq(false)
    await a.reduceAsync((gcd: bigint) => gcd)
    expect(a.denominator).to.eq(1n)
    expect(a.numerator).to.eq(1n)
  })
  it('3/5 * 2 = 6/5', async () => {
    const a = new Fraction(3, 5)
    expect(a.denominator).to.eq(5n)
    expect(a.numerator).to.eq(3n)
    await a.multiplyAsync(2)
    expect(a.denominator).to.eq(5n)
    expect(a.numerator).to.eq(6n)
  })
  it('1 * 1/\'1\' throws an error', async () => {
    const a = new Fraction(1)
    expect(a.denominator).to.eq(1n)
    expect(a.numerator).to.eq(1n)
    let caught = false
    await a.multiplyAsync(1, '1' as unknown as bigint)
      .catch((err: unknown) => {
        expect(err).to.be.instanceOf(Error)
        if (err instanceof Error) {
          expect(err.message).to.be.a.string('illegal denominator type')
          caught = true
        }
      })
    expect(caught).to.be.eq(true)
  })
})

describe('reduce', () => {
  it('evaluate Irreducible', async () => {
    const a = new Fraction(8, 5)
    const reduced = a.reduce((gcd: bigint) => gcd)
    expect(reduced).to.be.instanceOf(Irreducible)
    if (typeof reduced === 'bigint')
      return
    expect(reduced.isIrreducible).to.be.eq(true)
    expect(reduced.reduce()).to.eq(reduced)
    expect(await reduced.reduceAsync((gcd: bigint) => gcd)).to.eq(reduced)
  })
  it('with callback', () => {
    const a = new Fraction(32, 48)
    expect(a.reduce((gcd: bigint) => gcd)).to.eq(16n)
  })
})

describe('reduceAsync', async () => {
  it('irreducible', async () => {
    const a = new Fraction(1)
    expect(await a.reduceAsync((gcd: bigint) => gcd)).to.be.instanceOf(Irreducible)
  })
  it('reducible and with callback', async () => {
    const a = new Fraction(32, 48)
    expect(await a.reduceAsync((gcd: bigint) => gcd)).to.eq(16n)
  })
})

describe('subtract', () => {
  it('1 - 1/2 = 1/2', () => {
    const a = new Fraction(1)
    expect(a.denominator).to.eq(1n)
    expect(a.numerator).to.eq(1n)
    a.subtract(1, 2)
    expect(a.denominator).to.eq(2n)
    expect(a.numerator).to.eq(1n)
  })
  it('1/3 - Fraction(1/2) = -1/6', () => {
    const a = new Fraction(1, 3)
    expect(a.denominator).to.eq(3n)
    expect(a.numerator).to.eq(1n)
    a.subtract(new Fraction(1, 2))
    expect(a.denominator).to.eq(6n)
    expect(a.numerator).to.eq(-1n)
  })
  it('1/2 - FractionLike(1/3) = 1/6', () => {
    const a = new Fraction(1, 2)
    expect(a.denominator).to.eq(2n)
    expect(a.numerator).to.eq(1n)
    a.subtract({ denominator: 3n, numerator: 1n })
    expect(a.denominator).to.eq(6n)
    expect(a.numerator).to.eq(1n)
  })
})

describe('subtractAsync', () => {
  it('1 - 1/2 = 1/2', async () => {
    const a = new Fraction(1)
    expect(a.denominator).to.eq(1n)
    expect(a.numerator).to.eq(1n)
    await a.subtractAsync(1, 2)
    expect(a.denominator).to.eq(2n)
    expect(a.numerator).to.eq(1n)
  })
  it('1/3 - Fraction(1/2) = -1/6', async () => {
    const a = new Fraction(1, 3)
    expect(a.denominator).to.eq(3n)
    expect(a.numerator).to.eq(1n)
    await a.subtractAsync(new Fraction(1, 2))
    expect(a.denominator).to.eq(6n)
    expect(a.numerator).to.eq(-1n)
  })
  it('1/2 - FractionLike(1/3) = 1/6', async () => {
    const a = new Fraction(1, 2)
    expect(a.denominator).to.eq(2n)
    expect(a.numerator).to.eq(1n)
    await a.subtractAsync({ denominator: 3n, numerator: 1n })
    expect(a.denominator).to.eq(6n)
    expect(a.numerator).to.eq(1n)
  })
})

describe('toString', () => {
  it('-Infinity', () => {
    const a = new Fraction(-1, 0)
    expect(a.toString()).to.eq('-Infinity')
  })
  it('Infinity', () => {
    const a = new Fraction(1, 0)
    expect(a.toString()).to.eq('Infinity')
  })
  it('NaN', () => {
    const a = new Fraction(0, 0)
    expect(a.toString()).to.eq('NaN')
  })
  it('-1/2', () => {
    const a = new Fraction(-1, 2)
    expect(a.toString()).to.eq('-0.5')
  })
  it('-1/-2', () => {
    const a = new Fraction(-1, -2)
    expect(a.toString()).to.eq('0.5')
  })
  it('1.0123456789', () => {
    const a = new Fraction(10123456789, 10000000000)
    expect(a.toString()).to.eq('1.0123456789')
  })
  it('1/-2', () => {
    const a = new Fraction(1, -2)
    expect(a.toString()).to.eq('-0.5')
  })
  it('1/3', () => {
    const a = new Fraction(1, 3)
    expect(a.toString(10)).to.eq('0.3333333333')
  })
})
