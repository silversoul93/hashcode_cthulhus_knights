'use strict'

const tap = require('tap')
const path = require('path')

const { teamsExtractor, pizzasSorter, pizzasManager } = require('../index')
const fileParser = require('../../../fileParser/index')

tap.test('teamsExtractor', assert => {
  teamsExtractor(100000, 39748, 49195, 29832)
  assert.end()
})

tap.test('pizzasSorter', assert => {
  const { rows } = fileParser(path.join(__dirname, '../../../../fixtures/b_little_bit_of_everything.in'), { splitInRows: true })
  const [header, ...pizzas] = rows
  const sortedPizzas = pizzasSorter(pizzas)
  console.log(sortedPizzas)
  assert.end()
})

tap.test('pizzasManager', assert => {
  const { rows } = fileParser(path.join(__dirname, '../../../../fixtures/b_little_bit_of_everything.in'), { splitInRows: true })
  const [header, ...pizzas] = rows
  const [pizzasNumber, t2, t3, t4] = header.split(' ').filter(x => x)
  const result = pizzasManager({ pizzasNumber, t2, t3, t4 }, pizzas)
  console.log(result)
  assert.end()
})
