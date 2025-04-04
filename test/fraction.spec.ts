import { Fraction, Irreducible } from '../src/index'
import { deepEqual, equal, notEqual, throws } from 'node:assert'
import { describe, it } from 'mocha'

describe('add', () => {
  it('0 + 1 = 1', () => {
    const a = new Fraction()
    equal(a.denominator, 1n)
    equal(a.numerator, 0n)
    a.add(1)
    equal(a.denominator, 1n)
    equal(a.numerator, 1n)
  })
  it('1/2 + 1/3 = 5/6', () => {
    const a = new Fraction(1, 2)
    equal(a.denominator, 2n)
    equal(a.numerator, 1n)
    a.add(1, 3)
    equal(a.denominator, 6n)
    equal(a.numerator, 5n)
  })
  it('1/2 + 1/3n = 5/6', () => {
    const a = new Fraction(1, 2)
    equal(a.denominator, 2n)
    equal(a.numerator, 1n)
    a.add(1, 3n)
    equal(a.denominator, 6n)
    equal(a.numerator, 5n)
  })
  it('0 + 1/\'1\' throws an error', () => {
    const a = new Fraction()
    equal(a.denominator, 1n)
    equal(a.numerator, 0n)
    throws(
      () => a.add(0, '1' as unknown as bigint),
      new Error('illegal denominator type')
    )
  })
})

describe('addAsync', () => {
  it('0 + 1 = 1', async () => {
    const a = new Fraction()
    equal(a.denominator, 1n)
    equal(a.numerator, 0n)
    await a.addAsync(1)
    equal(a.denominator, 1n)
    equal(a.numerator, 1n)
  })
  it('1/2 + 1/3 = 5/6', async () => {
    const a = new Fraction(1, 2)
    equal(a.denominator, 2n)
    equal(a.numerator, 1n)
    await a.addAsync(1, 3)
    equal(a.denominator, 6n)
    equal(a.numerator, 5n)
  })
  it('1/2 + 1/3n = 5/6', async () => {
    const a = new Fraction(1, 2)
    equal(a.denominator, 2n)
    equal(a.numerator, 1n)
    await a.addAsync(1, 3n)
    equal(a.denominator, 6n)
    equal(a.numerator, 5n)
  })
  it('0 + 1/\'1\' throws an error', async () => {
    const a = new Fraction()
    equal(a.denominator, 1n)
    equal(a.numerator, 0n)
    let caught = false
    await a.addAsync(0, '1' as unknown as bigint)
      .catch((err: unknown) => {
        equal(err instanceof Error, true)
        if (err instanceof Error) {
          equal(err.message, 'illegal denominator type')
          caught = true
        }
      })
    equal(caught, true)
  })
})

describe('constructor', () => {
  it('clone', () => {
    const a = new Fraction()
    equal(a.denominator, 1n)
    equal(a.numerator, 0n)
    const b = a.clone()
    notEqual(b, a)
    deepEqual(b, a)
    equal(b.denominator, 1n)
    equal(b.numerator, 0n)
    a.reduce()
    const c = a.clone()
    notEqual(c, a)
    deepEqual(c, a)
    equal(c.denominator, 1n)
    equal(c.numerator, 0n)
  })
  it('like', () => {
    const a = new Fraction({
      denominator: 0n,
      numerator: 1n,
    })
    equal(a.denominator, 0n)
    equal(a.numerator, 1n)
  })
  it('null denominator', () => {
    const a = new Fraction(1, null as unknown as undefined)
    equal(a.denominator, 1n)
    equal(a.numerator, 1n)
  })
  it('undefined denominator', () => {
    const a = new Fraction(1)
    equal(a.denominator, 1n)
    equal(a.numerator, 1n)
  })
})

describe('divide', () => {
  it('1 / 2 = 1/2', () => {
    const a = new Fraction(1)
    equal(a.denominator, 1n)
    equal(a.numerator, 1n)
    a.divide(2)
    equal(a.denominator, 2n)
    equal(a.numerator, 1n)
  })
  it('1 / 1/2 = 2', () => {
    const a = new Fraction(1)
    equal(a.denominator, 1n)
    equal(a.numerator, 1n)
    a.divide(new Fraction(1, 2))
    equal(a.denominator, 1n)
    equal(a.numerator, 2n)
  })
})

describe('divideAsync', () => {
  it('1 / 2 = 1/2', async () => {
    const a = new Fraction(1)
    equal(a.denominator, 1n)
    equal(a.numerator, 1n)
    await a.divideAsync(2)
    equal(a.denominator, 2n)
    equal(a.numerator, 1n)
  })
  it('1 / 1/2 = 2', async () => {
    const a = new Fraction(1)
    equal(a.denominator, 1n)
    equal(a.numerator, 1n)
    await a.divideAsync(new Fraction(1, 2))
    equal(a.denominator, 1n)
    equal(a.numerator, 2n)
  })
})

describe('isIrreducible', () => {
  const a = new Fraction(5, 3)
  it('5/3 is irreducible', () => {
    equal(a.denominator, 3n)
    equal(a.numerator, 5n)
    equal(a.isIrreducible, true)
  })
  it('call twice', () =>
    equal(a.isIrreducible, true)
  )
})

describe('multiply', () => {
  it('2 * Fraction(1/2) = 1', () => {
    const a = new Fraction(2)
    equal(a.denominator, 1n)
    equal(a.numerator, 2n)
    a.multiply(new Fraction(1, 2))
    equal(a.isIrreducible, false)
    a.reduce()
    equal(a.denominator, 1n)
    equal(a.numerator, 1n)
  })
  it('2 * 1/2 = 1', () => {
    const a = new Fraction(2)
    equal(a.denominator, 1n)
    equal(a.numerator, 2n)
    a.multiply(1, 2)
    equal(a.isIrreducible, false)
    a.reduce()
    equal(a.denominator, 1n)
    equal(a.numerator, 1n)
  })
  it('2 * 1/2n = 1', () => {
    const a = new Fraction(2)
    equal(a.denominator, 1n)
    equal(a.numerator, 2n)
    a.multiply(1, 2n)
    equal(a.isIrreducible, false)
    a.reduce()
    equal(a.denominator, 1n)
    equal(a.numerator, 1n)
  })
  it('3/5 * 2 = 6/5', () => {
    const a = new Fraction(3, 5)
    equal(a.denominator, 5n)
    equal(a.numerator, 3n)
    a.multiply(2)
    equal(a.denominator, 5n)
    equal(a.numerator, 6n)
  })
  it('1 * 1/\'1\' throws an error', () => {
    const a = new Fraction(1)
    equal(a.denominator, 1n)
    equal(a.numerator, 1n)
    throws(
      () => a.multiply(1, '1' as unknown as bigint),
      new Error('illegal denominator type')
    )
  })
})

describe('multiplyAsync', () => {
  it('2 * Fraction(1/2) = 1', async () => {
    const a = new Fraction(2)
    equal(a.denominator, 1n)
    equal(a.numerator, 2n)
    await a.multiplyAsync(new Fraction(1, 2))
    equal(a.isIrreducible, false)
    await a.reduceAsync((gcd: bigint) => gcd)
    equal(a.denominator, 1n)
    equal(a.numerator, 1n)
  })
  it('2 * 1/2 = 1', async () => {
    const a = new Fraction(2)
    equal(a.denominator, 1n)
    equal(a.numerator, 2n)
    await a.multiplyAsync(1, 2)
    equal(a.isIrreducible, false)
    await a.reduceAsync((gcd: bigint) => gcd)
    equal(a.denominator, 1n)
    equal(a.numerator, 1n)
  })
  it('2 * 1/2n = 1', async () => {
    const a = new Fraction(2)
    equal(a.denominator, 1n)
    equal(a.numerator, 2n)
    await a.multiplyAsync(1, 2n)
    equal(a.isIrreducible, false)
    await a.reduceAsync((gcd: bigint) => gcd)
    equal(a.denominator, 1n)
    equal(a.numerator, 1n)
  })
  it('3/5 * 2 = 6/5', async () => {
    const a = new Fraction(3, 5)
    equal(a.denominator, 5n)
    equal(a.numerator, 3n)
    await a.multiplyAsync(2)
    equal(a.denominator, 5n)
    equal(a.numerator, 6n)
  })
  it('1 * 1/\'1\' throws an error', async () => {
    const a = new Fraction(1)
    equal(a.denominator, 1n)
    equal(a.numerator, 1n)
    let caught = false
    await a.multiplyAsync(1, '1' as unknown as bigint)
      .catch((err: unknown) => {
        equal(err instanceof Error, true)
        if (err instanceof Error) {
          equal(err.message, 'illegal denominator type')
          caught = true
        }
      })
    equal(caught, true)
  })
})

describe('reduce', () => {
  it('evaluate Irreducible', async () => {
    const a = new Fraction(8, 5)
    const reduced = a.reduce((gcd: bigint) => gcd)
    equal(reduced instanceof Irreducible, true)
    if (typeof reduced === 'bigint')
      return
    equal(reduced.isIrreducible, true)
    equal(reduced.reduce(), reduced)
    equal(await reduced.reduceAsync((gcd: bigint) => gcd), reduced)
  })
  it('with callback', () => {
    const a = new Fraction(32, 48)
    equal(a.reduce((gcd: bigint) => gcd), 16n)
  })
})

describe('reduceAsync', async () => {
  it('irreducible', async () => {
    const a = new Fraction(1)
    equal(await a.reduceAsync((gcd: bigint) => gcd) instanceof Irreducible, true)
  })
  it('reducible and with callback', async () => {
    const a = new Fraction(32, 48)
    equal(await a.reduceAsync((gcd: bigint) => gcd), 16n)
  })
})

describe('subtract', () => {
  it('1 - 1/2 = 1/2', () => {
    const a = new Fraction(1)
    equal(a.denominator, 1n)
    equal(a.numerator, 1n)
    a.subtract(1, 2)
    equal(a.denominator, 2n)
    equal(a.numerator, 1n)
  })
  it('1/3 - Fraction(1/2) = -1/6', () => {
    const a = new Fraction(1, 3)
    equal(a.denominator, 3n)
    equal(a.numerator, 1n)
    a.subtract(new Fraction(1, 2))
    equal(a.denominator, 6n)
    equal(a.numerator, -1n)
  })
  it('1/2 - FractionLike(1/3) = 1/6', () => {
    const a = new Fraction(1, 2)
    equal(a.denominator, 2n)
    equal(a.numerator, 1n)
    a.subtract({ denominator: 3n, numerator: 1n })
    equal(a.denominator, 6n)
    equal(a.numerator, 1n)
  })
})

describe('subtractAsync', () => {
  it('1 - 1/2 = 1/2', async () => {
    const a = new Fraction(1)
    equal(a.denominator, 1n)
    equal(a.numerator, 1n)
    await a.subtractAsync(1, 2)
    equal(a.denominator, 2n)
    equal(a.numerator, 1n)
  })
  it('1/3 - Fraction(1/2) = -1/6', async () => {
    const a = new Fraction(1, 3)
    equal(a.denominator, 3n)
    equal(a.numerator, 1n)
    await a.subtractAsync(new Fraction(1, 2))
    equal(a.denominator, 6n)
    equal(a.numerator, -1n)
  })
  it('1/2 - FractionLike(1/3) = 1/6', async () => {
    const a = new Fraction(1, 2)
    equal(a.denominator, 2n)
    equal(a.numerator, 1n)
    await a.subtractAsync({ denominator: 3n, numerator: 1n })
    equal(a.denominator, 6n)
    equal(a.numerator, 1n)
  })
})

describe('toString', () => {
  it('-Infinity', () => {
    const a = new Fraction(-1, 0)
    equal(a.toString(), '-Infinity')
  })
  it('Infinity', () => {
    const a = new Fraction(1, 0)
    equal(a.toString(), 'Infinity')
  })
  it('NaN', () => {
    const a = new Fraction(0, 0)
    equal(a.toString(), 'NaN')
  })
  it('-1/2', () => {
    const a = new Fraction(-1, 2)
    equal(a.toString(), '-0.5')
  })
  it('-1/-2', () => {
    const a = new Fraction(-1, -2)
    equal(a.toString(), '0.5')
  })
  it('1.0123456789', () => {
    const a = new Fraction(10123456789, 10000000000)
    equal(a.toString(), '1.0123456789')
  })
  it('1/-2', () => {
    const a = new Fraction(1, -2)
    equal(a.toString(), '-0.5')
  })
  it('1/3', () => {
    const a = new Fraction(1, 3)
    equal(a.toString(10), '0.3333333333')
  })
})
