'use strict'

const teamsExtractor = (pizzasNumber, t2, t3, t4) => {
  const teamsMap = {
    t2: 0,
    t3: 0,
    t4: 0
  }
  let servedPizzas = 0
  if (pizzasNumber % 2 === 1 && t3 > 0) {
    teamsMap.t3 += 1
    servedPizzas += 3
  }

  const potentialT4TeamsToServe = Math.floor((pizzasNumber - servedPizzas) / 4)
  const t4ToServe = potentialT4TeamsToServe <= t4
    ? potentialT4TeamsToServe
    : t4
  servedPizzas += t4ToServe * 4
  teamsMap.t4 += t4ToServe

  const potentialT3TeamsToServe = Math.floor((pizzasNumber - servedPizzas) / 3)
  const t3ToServe = potentialT3TeamsToServe <= t3
    ? potentialT3TeamsToServe
    : t3
  servedPizzas += t3ToServe * 3
  teamsMap.t3 += t3ToServe

  const potentialT2TeamsToServe = Math.floor((pizzasNumber - servedPizzas) / 2)
  const t2ToServe = potentialT2TeamsToServe <= t2
    ? potentialT2TeamsToServe
    : t2
  servedPizzas += t2ToServe * 2
  teamsMap.t2 += t2ToServe

  // if ((pizzasNumber - servedPizzas + 3) % 4 === 0) {
  //   t3ToServe--
  //   servedPizzas -= 3
  // }

  console.log(teamsMap)
  return teamsMap
}

const lget = require('lodash.get')

/*
  pizzasOrdered = [
    {
      index: 9,
      ingredientsNumber: 99,
      ingredients: ['mushrooms']
    }
  ]
*/

const pizzasSorter = (pizzas) => {
  console.time('pizzasList')
  const pizzasList = pizzas.map((pizza, index) => {
    const [ingredientsNumber, ...ingredients] = pizza.split(' ').filter(x => x)
    return {
      inputPizzaIndex: index,
      ingredientsNumber,
      ingredients: ingredients.sort().join(' ')
    }
  })
  console.timeEnd('pizzasList')
  return pizzasList.sort((a, b) => b.ingredientsNumber - a.ingredientsNumber)
}

const compare = (a, b) => {
  if (a.ingredients < b.ingredients) {
    return -1
  }
  if (a.ingredients > b.ingredients) {
    return 1
  }
  return 0
}

const pizzasManager = (
  { pizzasNumber, t2, t3, t4 },
  pizzas
) => {
  let { t2: t2ToServe, t3: t3ToServe, t4: t4ToServe } = teamsExtractor(pizzasNumber, +t2, +t3, +t4)
  const sortedPizzas = pizzasSorter(pizzas)

  const servedTeams = t2ToServe + t3ToServe + t4ToServe
  const result = [servedTeams]
  const t4TotalPizzas = t4ToServe * 4
  const t3TotalPizzas = t3ToServe * 3
  const t4Pizzas = sortedPizzas.slice(0, t4TotalPizzas).sort(compare)
  let pizzasIndex1 = 0
  let pizzasIndex2 = t4ToServe
  let pizzasIndex3 = t4ToServe * 2
  let pizzasIndex4 = t4ToServe * 3

  while (t4ToServe > 0) {
    const p1 = lget(t4Pizzas, [pizzasIndex1, 'inputPizzaIndex'], '')
    const p2 = lget(t4Pizzas, [pizzasIndex2, 'inputPizzaIndex'], '')
    const p3 = lget(t4Pizzas, [pizzasIndex3, 'inputPizzaIndex'], '')
    const p4 = lget(t4Pizzas, [pizzasIndex4, 'inputPizzaIndex'], '')
    result.push(`${`4 ${p1} ${p2} ${p3} ${p4}`.trim()}`)
    pizzasIndex1++
    pizzasIndex2++
    pizzasIndex3++
    pizzasIndex4++
    t4ToServe--
  }

  const t3Pizzas = sortedPizzas.slice(t4TotalPizzas, t4TotalPizzas + t3TotalPizzas)
  t3Pizzas.sort((a, b) => b.ingredients - a.ingredients)
  pizzasIndex1 = 0
  pizzasIndex2 = t3ToServe
  pizzasIndex3 = t3ToServe * 2
  while (t3ToServe > 0) {
    const p1 = lget(t3Pizzas, [pizzasIndex1, 'inputPizzaIndex'], '')
    const p2 = lget(t3Pizzas, [pizzasIndex2, 'inputPizzaIndex'], '')
    const p3 = lget(t3Pizzas, [pizzasIndex3, 'inputPizzaIndex'], '')
    result.push(`${`3 ${p1} ${p2} ${p3}`.trim()}`)
    pizzasIndex1++
    pizzasIndex2++
    pizzasIndex3++
    t3ToServe--
  }

  const t2Pizzas = sortedPizzas.slice(t4TotalPizzas + t3TotalPizzas)
  t2Pizzas.sort((a, b) => b.ingredients - a.ingredients)
  pizzasIndex1 = 0
  pizzasIndex2 = t2ToServe
  while (t2ToServe > 0) {
    const p1 = lget(t2Pizzas, [pizzasIndex1, 'inputPizzaIndex'], '')
    const p2 = lget(t2Pizzas, [pizzasIndex2, 'inputPizzaIndex'], '')
    result.push(`${`2 ${p1} ${p2}`.trim()}`)
    pizzasIndex1++
    pizzasIndex2++
    t2ToServe--
  }

  return result
}

module.exports = {
  pizzasManager,
  teamsExtractor,
  pizzasSorter
}
