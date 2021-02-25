'use strict'

const path = require('path')
const fileParser = require('./src/fileParser')
const { pizzasManager } = require('./src/managers/pizzasManager')
const fs = require('fs-extra')
const get = require('lodash.get')
const set = require('lodash.set')

const files = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
]

function parseFile(fileName) {
  const { rows } = fileParser(
    path.join(__dirname, `./fixtures/${fileName}.txt`),
    { splitInRows: true }
  )
  const [header, ...others] = rows
  const [executionTime, interceptionsCount, streetsCount, carsCount, carScore] = header.split(' ').filter(x => x)
  const rawStreets = others.slice(0, streetsCount)
  const rawCars = others.slice(streetsCount)
  if (rawCars.length != carsCount) {
    console.log("cars.length != carsCount", rawCars.length, carsCount)
  }
  const { streets, interceptions } = rawStreets.reduce((acc, string) => {
    const [idStart, idEnd, streetName, travelTime] = string.split(' ')
    acc.streets[streetName] = {
      idStart: parseInt(idStart, 10),
      idEnd: parseInt(idEnd, 10),
      travelTime: parseInt(travelTime, 10)
    }

    const getInStreets = get(acc, ['interceptions', idEnd, 'inStreets'], [])
    set(acc, ['interceptions', idEnd, 'inStreets'], [...getInStreets, streetName])
    const getOutStrees = get(acc, ['interceptions', idStart, 'outStreets'], [])
    set(acc, ['interceptions', idStart, 'outStreets'], [...getOutStrees, streetName])

    return acc
  }, { streets: {}, interceptions: {} })

  if (interceptions.length != interceptionsCount) {
    console.log("interceptions.length != interceptionsCount", interceptions.length, interceptionsCount)
  }
  const carPaths = rawCars.map(string => {
    const [streetsInPathsCount, ...streetsInPath] = string.split(' ')
    return {
      streetsInPathsCount,
      streetsInPath
    }
  })

  return {
    streets,
    carPaths,
    interceptions
  }
}

const start = () => {
  files.forEach(fileName => {
    // ********* FILE PARSING ***********
    const { carPaths, streets, interceptions } = parseFile(fileName)
    const interceptionsCount = Object.keys(interceptions).length
    // console.log('carPaths', carPaths)
    // console.log('streets', streets)
    // console.log('interceptions', interceptions)
    // console.log('interceptionsCount', interceptionsCount)

    // ******** OUTPUT WRITING ***********
    const result = [interceptionsCount]
    for (const interceptionId in interceptions) {
      const { inStreets, outStreets } = interceptions[interceptionId]
      const schedule = [interceptionId]
      schedule.push(inStreets.length)
      schedule.push(inStreets.map(name => `${name} 1`))
      result.push(...schedule)
    }
    const output = result.join().replace(/,/g, '\n')
    fs.outputFileSync(`./results/${fileName}.out`, output, { encoding: 'utf-8' })

    // const result = pizzasManager({ pizzasNumber: executionTime, t2: interceptionNumber, t3, t4: carNumber }, others)
    // const output = result.join().replace(/,/g, '\n')
    // fs.outputFileSync(`./results/${fileName}.out`, output, { encoding: 'utf-8' })
  })
}

start()

module.exports = {
  fileParser,
  pizzasManager: start
}