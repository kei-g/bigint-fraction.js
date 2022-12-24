# bigint-fraction [![license][license-image]][license-url] [![npm][npm-image]][npm-url]

[![coverage][nyc-cov-image]][github-url] [![dependency][depencency-image]][dependency-url] [![maintenance][maintenance-image]][npmsio-url] [![quality][quality-image]][npmsio-url]

`bigint-fraction` - Fraction composed of bigint

## CI Status

| Target | Status |
|-|-|
| Build | [![GitHub (Build)][github-build-image]][github-build-url] |
| CodeQL | [![GitHub (CodeQL)][github-codeql-image]][github-codeql-url] |
| Coverage | [![GitHub (Coverage)][github-coverage-image]][github-coverage-url] |

## Installation

```shell
npm i bigint-fraction
```

## Usage

Example usage as below,

```typescript
import { Fraction, Irreducible } from 'bigint-fraction'

const a = new Fraction() // initialize 'a' as zero
const b = new Fraction(0) // also initialize 'b' as zero
const c = new Fraction(1, 4) // initialize 'c' with 1/4

a.add(3) // add 3 to 'a', then 'a' is equal to 3
b.subtract(1, 2) // subtract 1/2 from 'b', then 'b' is equal to -1/2
c.add(1, 2) // add 1/2 to 'c', then 'c' is equal to 3/4

a.add(b) // add 'b' to 'a', then 'a' is equal to 5/2
a.subtract(c) // subtract 'c' from 'a', then 'a' is equal to 7/4

a.multiply(4) // mutiply 4 to 'a', then 'a' is equal to 7

const d = new Fraction(4, 6) // initialize 'd' as 4/6, this is reducible
const result = d.reduce((gcd: bigint) => { // reduce 'd'
  assert(gcd === 2n) // greatest common divisor is expected to equal to 2
  return 12345
})
if (result instanceof Irreducible)
  throw new Error('never reach here')
assert(result === 12345)

const maybePI = d.reduce((gcd: bigint) => { // reduce 'd' again
  assert(false) // this callback has never been called
  return Math.PI
})
if (maybePI instanceof Irreducible)
  console.log(`yes, 'd' has been already reduced`) // this message will be shown
else
  console.log('this message could have never been shown')
```

async/await is also available as below,

```typescript
import { Fraction } from 'bigint-fraction'

async function doSomething(a: Fraction, b: Fraction, c: Fraction): Promise<void> => {
  await a.addAsync(11, 8) // simply add 11/8 to 'a' asynchronously

  const d = new Fraction(32, 48)
  const hasBeenReduced = await d.reduceAsync((gcd: bigint) => { // reduce 32/48 asynchronously
    console.log({ greatest_common_divisor: gcd })
    return `yes, ${d.denominator}/${d.numerator} is reduced by ${gcd}`
  })
  assert(hasBeenReduced === 'yes, 32/48 is reduced by 16')
  assert(d.numerator === 2n)
  assert(d.denominator === 3n)

  await Promise.all([ // evaluate multiple expressions concurrently
    b.divideAsync(c),
    a.multiplyAsync(3141592653589793238462643383279n, 5028841971693993751058209749445923n),
    d.subtractAsync(c),
  ])
}
```

[depencency-image]:https://img.shields.io/librariesio/release/npm/bigint-fraction?logo=nodedotjs
[dependency-url]:https://npmjs.com/package/bigint-fraction?activeTab=dependencies
[github-build-image]:https://github.com/kei-g/bigint-fraction.js/actions/workflows/build.yml/badge.svg
[github-build-url]:https://github.com/kei-g/bigint-fraction.js/actions/workflows/build.yml
[github-codeql-image]:https://github.com/kei-g/bigint-fraction.js/actions/workflows/codeql.yml/badge.svg
[github-codeql-url]:https://github.com/kei-g/bigint-fraction.js/actions/workflows/codeql.yml
[github-coverage-image]:https://github.com/kei-g/bigint-fraction.js/actions/workflows/coverage.yml/badge.svg
[github-coverage-url]:https://github.com/kei-g/bigint-fraction.js/actions/workflows/coverage.yml
[github-url]:https://github.com/kei-g/bigint-fraction.js
[license-image]:https://img.shields.io/github/license/kei-g/bigint-fraction.js
[license-url]:https://opensource.org/licenses/BSD-3-Clause
[maintenance-image]:https://img.shields.io/npms-io/maintenance-score/bigint-fraction?logo=npm
[npm-image]:https://img.shields.io/npm/v/bigint-fraction.svg?logo=npm
[npm-url]:https://npmjs.org/package/bigint-fraction
[npmsio-url]:https://npms.io/search?q=bigint-fraction
[nyc-cov-image]:https://img.shields.io/nycrc/kei-g/bigint-fraction.js?config=.nycrc.json&label=coverage&logo=mocha
[quality-image]:https://img.shields.io/npms-io/quality-score/bigint-fraction?logo=npm
