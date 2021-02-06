'use strict'

const path = require('path')
const fileParser = require('./src/fileParser')
const { pizzasManager } = require('./src/managers/pizzasManager')
const fs = require('fs-extra')

const files = [
  'a_example',
  'b_little_bit_of_everything',
  'c_many_ingredients',
  'd_many_pizzas',
  'e_many_teams'
]

const start = () => {
  files.forEach(fileName => {
    const { rows } = fileParser(
      path.join(__dirname, `./fixtures/${fileName}.in`),
      { splitInRows: true }
    )
    const [header, ...pizzas] = rows
    const [pizzasNumber, t2, t3, t4] = header.split(' ').filter(x => x)
    const result = pizzasManager({ pizzasNumber, t2, t3, t4 }, pizzas)
    const output = result.join().replace(/,/g, '\n')
    fs.outputFileSync(`./results/${fileName}.out`, output, { encoding: 'utf-8' })
  })
}

start()

module.exports = {
  fileParser,
  pizzasManager: start
}
