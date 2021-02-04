const tap = require('tap')
const path = require('path')

const fileParser = require('..')

const FIXTURE_FILE_PATH = path.join(__dirname, './fixtures/pizzaOrderTest')

tap.test('fileParser', (tap) => {
  tap.test('expect to receive a string', (tap) => {
    const { file } = fileParser(FIXTURE_FILE_PATH)
    tap.strictSame(file, '5 1 2 1 \n3 onion pepper olive\n3 mushroom tomato basil\n3 chicken mushroom pepper\n3 tomato mushroom basil\n2 chicken basil\n')

    tap.end()
  })

  tap.test('expect to see correct error message on fails parse', (tap) => {
    tap.throw(() => fileParser('NOT_EXISTING_FILE_PATH'), 'File not exist')

    tap.end()
  })

  tap.test('expect to receive a split string for each new line', (tap) => {
    const { rows } = fileParser(FIXTURE_FILE_PATH, { splitInRows: true })
    tap.strictSame(rows, [
      '5 1 2 1 ',
      '3 onion pepper olive',
      '3 mushroom tomato basil',
      '3 chicken mushroom pepper',
      '3 tomato mushroom basil',
      '2 chicken basil'
    ])

    tap.end()
  })

  tap.end()
})
