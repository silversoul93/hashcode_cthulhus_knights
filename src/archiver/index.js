'use strict'

const fs = require('fs')
const archiver = require('archiver')
const path = require('path')

const verifyPaths = (inputPath, outputPath) => {
  if (!fs.existsSync(inputPath)) {
    throw new Error(`Unexisting input file or directory ${inputPath}`)
  }
  if (!outputPath || outputPath.trim() === '' || !fs.existsSync(outputPath)) {
    throw new Error('The output path is required and must exist')
  }
}

const zipFile = async (inputPath, outputPath, zipFileName = 'output.zip') => {
  verifyPaths(inputPath, outputPath)

  const outputStream = fs.createWriteStream(`${outputPath}/${zipFileName}`)
  const archive = archiver('zip', {
    zlib: { level: 9 }
  })

  outputStream.on('close', function () {
    console.log(archive.pointer() + ' total bytes')
    console.log('archiver has been finalized and the output file descriptor has closed.')
  })

  archive.pipe(outputStream)
  archive.file(inputPath, { name: path.basename(inputPath) })

  await archive.finalize()
}

const zipDirectory = async (inputDirectory, outputPath, zipFileName = 'output.zip') => {
  verifyPaths(inputDirectory, outputPath)

  const outputStream = fs.createWriteStream(`${outputPath}/${zipFileName}`)
  const archive = archiver('zip', {
    zlib: { level: 9 }
  })

  outputStream.on('close', function () {
    console.log(archive.pointer() + ' total bytes')
    console.log('archiver has been finalized and the output file descriptor has closed.')
  })

  archive.pipe(outputStream)
  archive.directory(inputDirectory, false)

  await archive.finalize()
}

module.exports = {
  zipFile,
  zipDirectory
}
