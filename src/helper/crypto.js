const { randomBytes } = require('crypto');

function generateKey(size = 32, format = 'base64') {
  const buffer = randomBytes(size);
  return buffer.toString(format);
}

module.exports = { generateKey }
