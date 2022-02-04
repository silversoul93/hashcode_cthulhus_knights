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

  return {
  }
}

const start = () => {
  files.forEach(fileName => {
    const { } = parseFile(fileName)

    const output = ''
    fs.outputFileSync(`./results/${fileName}.out`, output, { encoding: 'utf-8' })
  })
}

start()

module.exports = {
  fileParser,
}
