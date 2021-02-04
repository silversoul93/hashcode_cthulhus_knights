const fs = require('fs-extra')

function fileParser (filePath, options = {}) {
  const { splitInRows } = options

  if (!fs.existsSync(filePath)) {
    throw new Error('File not exist')
  }

  const file = fs.readFileSync(filePath, 'utf8')
  const rows = splitInRows ? { rows: file.split('\n').filter(row => row) } : {}

  return {
    file,
    ...rows
  }
}

module.exports = fileParser
