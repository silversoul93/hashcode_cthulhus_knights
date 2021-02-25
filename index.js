'use strict'

const path = require('path')
const fileParser = require('./src/fileParser')
const fs = require('fs-extra')
const get = require('lodash.get')
const set = require('lodash.set')

const files = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f'
]

function parseFile (fileName) {
  const { rows } = fileParser(
    path.join(__dirname, `./fixtures/${fileName}.txt`),
    { splitInRows: true }
  )
  const [header, ...others] = rows
  const [executionTime, interceptionsCount, streetsCount, carsCount, carScore] = header.split(' ').filter(x => x)
  const rawStreets = others.slice(0, streetsCount)
  const rawCars = others.slice(streetsCount)
  // eslint-disable-next-line eqeqeq
  if (rawCars.length != carsCount) {
    console.log('cars.length != carsCount', rawCars.length, carsCount)
  }
  const { streets, interceptions } = rawStreets.reduce((acc, string) => {
    const [idStart, idEnd, streetName, travelTime] = string.split(' ')
    acc.streets[streetName] = {
      idStart: parseInt(idStart, 10),
      idEnd: parseInt(idEnd, 10),
      travelTime: parseInt(travelTime, 10),
      carFlow: 0
    }

    const getInStreets = get(acc, ['interceptions', idEnd, 'inStreets'], [])
    set(acc, ['interceptions', idEnd, 'inStreets'], [...getInStreets, streetName])
    const getOutStrees = get(acc, ['interceptions', idStart, 'outStreets'], [])
    set(acc, ['interceptions', idStart, 'outStreets'], [...getOutStrees, streetName])

    return acc
  }, { streets: {}, interceptions: {} })

  // eslint-disable-next-line eqeqeq
  if (Object.keys(interceptions).length != interceptionsCount) {
    console.log('interceptions.length != interceptionsCount', Object.keys(interceptions).length, interceptionsCount)
  }

  const carPaths = rawCars.map(string => {
    const [streetsInPathsCount, ...streetsInPath] = string.split(' ')
    for (const streetName of streetsInPath) {
      streets[streetName].carFlow += 1
    }

    return {
      streetsInPathsCount,
      streetsInPath
    }
  })

  return {
    streets,
    carPaths,
    interceptions,
    executionTime: parseInt(executionTime, 10)
  }
}

const start = () => {
  files.forEach(fileName => {
    // ********* FILE PARSING ***********
    const { carPaths, streets, interceptions, executionTime } = parseFile(fileName)
    const interceptionsCount = Object.keys(interceptions).length
    // console.log('carPaths', carPaths)
    // console.log('streets', streets)
    // console.log('interceptions', interceptions)
    // console.log('interceptionsCount', interceptionsCount)

    // ******** OUTPUT WRITING ***********
    // TODO: da fixare con un count. attualmente è sbagliato
    const result = []
    let schedulesCount = 0
    for (const interceptionId in interceptions) {
      const { inStreets, outStreets } = interceptions[interceptionId]
      const orderedInStreets = inStreets.sort((a, b) => {
        return streets[b].carFlow - streets[a].carFlow
      })
      // console.log(orderedInStreets)
      const schedule = []
      for (const street of orderedInStreets) {
        const lightDuration = streets[street].carFlow < executionTime
          ? streets[street].carFlow
          : executionTime
        if (lightDuration !== 0) {
          schedule.push(`${street} ${Math.ceil(lightDuration / orderedInStreets.length)}`)
        }
      }

      if (schedule.length > 0) {
        schedulesCount++
        result.push(interceptionId, schedule.length, ...schedule)
      }
    }
    const output = schedulesCount + '\n' + result.join().replace(/,/g, '\n')
    fs.outputFileSync(`./results/${fileName}.out`, output, { encoding: 'utf-8' })
  })
}

start()

module.exports = {
  fileParser,
  pizzasManager: start
}
