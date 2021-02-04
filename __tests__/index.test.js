const tap = require('tap')

const lib = require('../index.js')

tap.test('check export', (tap) => {
  tap.strictSame(Object.keys(lib), [
    'fileParser'
  ])

  tap.end()
})
