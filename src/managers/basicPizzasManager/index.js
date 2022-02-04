'use strict'

module.exports = (
  { pizzasNumber, t2, t3, t4 },
  pizzas
) => {
  const pizzasMap = {
    T2: [],
    T3: [],
    T4: []
  }
  const i = 0
  while (i < pizzas.length - 2) {
    if (t2 > 0) {
      i = i + 2
      pizzasMap.T2.push(i - 1)
      pizzasMap.T2.push(i - 2)
      pizzasNumber = pizzasNumber - 2
      t2 = t2 - 1
    }
    if (t3 > 0) {
      i = i + 3
      pizzasMap.T3.push(i - 1)
      pizzasMap.T3.push(i - 2)
      pizzasMap.T3.push(i - 2)
      pizzasNumber = pizzasNumber - 3
      t3 = t3 - 1
    }
    if (t4 > 0) {
      i = i + 4
      pizzasMap.T2.push(i - 1)
      pizzasMap.T2.push(i - 2)
      pizzasMap.T2.push(i - 3)
      pizzasMap.T2.push(i - 3)

      pizzasNumber = pizzasNumber - 3
      t4 = t4 - 1
