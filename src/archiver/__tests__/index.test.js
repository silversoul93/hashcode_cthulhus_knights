'use strict'

const tap = require('tap')
const fs = require('fs')
const path = require('path')

const { zipFile, zipDirectory } = require('../')

const defaultOutputPath = path.join(__dirname, './fixtures')

tap.test('Testing the archiver - zipFile function -->', testCase => {
  testCase.test('KO - unexisting file - error', async assert => {
    const filePath = path.join(__dirname, './fixtures/unexistingFile')
    try {
      await zipFile(filePath, defaultOutputPath)
      assert.ok(false, 'The function should throw an error for Unexisting input file or directory')
    } catch (error) {
      assert.strictSame(error, new Error(`Unexisting input file or directory ${filePath}`))
    }
    assert.end()
  })

  testCase.test('KO - missing outputDirectory - error', async assert => {
    const filePath = path.join(__dirname, './fixtures/sampleFile.txt')
    try {
      await zipFile(filePath)
      assert.ok(false, 'The function should throw an error for missing output path')
    } catch (error) {
      assert.strictSame(error, new Error('The output path is required and must exist'))
    }
    assert.end()
  })

  testCase.test('KO - unexisting outputDirectory - error', async assert => {
    const filePath = path.join(__dirname, './fixtures/sampleFile.txt')
    try {
      await zipFile(filePath, `${defaultOutputPath}/unexistingDirectory`)
      assert.ok(false, 'The function should throw an error for unexisting directory')
    } catch (error) {
      assert.strictSame(error, new Error('The output path is required and must exist'))
    }
    assert.end()
  })

  testCase.test('OK - default file name', async assert => {
    const completeOutputName = `${defaultOutputPath}/output.zip`
    assert.tearDown(() => {
      fs.unlinkSync(completeOutputName)
    })
    const inputFilePath = path.join(__dirname, './fixtures/sampleFile.txt')
    assert.strictSame(fs.existsSync(completeOutputName), false, `The outputFile ${completeOutputName} should not exists befor the test start`)
    await zipFile(inputFilePath, defaultOutputPath)
    assert.strictSame(fs.existsSync(completeOutputName), true)
    assert.end()
  })

  testCase.test('OK - custom file name', async assert => {
    const completeOutputName = `${defaultOutputPath}/myCustomName.zip`
    assert.tearDown(() => {
      fs.unlinkSync(completeOutputName)
    })
    const inputFilePath = path.join(__dirname, './fixtures/sampleFile.txt')
    assert.strictSame(fs.existsSync(completeOutputName), false, `The outputFile ${completeOutputName} should not exists befor the test start`)
    await zipFile(inputFilePath, defaultOutputPath, 'myCustomName.zip')
    assert.strictSame(fs.existsSync(completeOutputName), true)
    assert.end()
  })

  testCase.end()
})

tap.test('Testing the archiver - zipDirectory function -->', testCase => {
  testCase.test('KO - unexisting input directory - error', async assert => {
    const inputDirectory = path.join(__dirname, './notTheFixturesDir')
    try {
      await zipDirectory(inputDirectory, defaultOutputPath)
      assert.ok(false, 'The function should throw an error for unexisting directory')
    } catch (error) {
      assert.strictSame(error, new Error(`Unexisting input file or directory ${inputDirectory}`))
    }
    assert.end()
  })

  testCase.test('KO - missing outputDirectory - error', async assert => {
    const inputDirectory = path.join(__dirname, './fixtures')
    try {
      await zipDirectory(inputDirectory)
      assert.ok(false, 'The function should throw an error for missing output path')
    } catch (error) {
      assert.strictSame(error, new Error('The output path is required and must exist'))
    }
    assert.end()
  })

  testCase.test('KO - unexisting outputDirectory - error', async assert => {
    const inputDirectory = path.join(__dirname, './fixtures/')
    try {
      await zipDirectory(inputDirectory, `${defaultOutputPath}/unexistingDirectory`)
      assert.ok(false, 'The function should throw an error for unexisting directory')
    } catch (error) {
      assert.strictSame(error, new Error('The output path is required and must exist'))
    }
    assert.end()
  })

  testCase.test('OK - default file name', async assert => {
    const completeOutputName = `${defaultOutputPath}/output.zip`
    assert.tearDown(() => {
      fs.unlinkSync(completeOutputName)
    })
    const inputDirectory = path.join(__dirname, './fixtures')
    assert.strictSame(fs.existsSync(completeOutputName), false, `The outputFile ${completeOutputName} should not exists befor the test start`)
    await zipDirectory(inputDirectory, defaultOutputPath)
    assert.strictSame(fs.existsSync(completeOutputName), true)
    assert.end()
  })

  testCase.test('OK - custom file name', async assert => {
    const completeOutputName = `${defaultOutputPath}/myCustomName.zip`
    assert.tearDown(() => {
      fs.unlinkSync(completeOutputName)
    })
    const inputDirectory = path.join(__dirname, './fixtures/inputDirectory/')
    assert.strictSame(fs.existsSync(completeOutputName), false, `The outputFile ${completeOutputName} should not exists befor the test start`)
    await zipDirectory(inputDirectory, defaultOutputPath, 'myCustomName.zip')
    assert.strictSame(fs.existsSync(completeOutputName), true)
    assert.end()
  })

  testCase.end()
})
