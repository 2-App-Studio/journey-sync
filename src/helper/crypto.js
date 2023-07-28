const { randomBytes, generateKeyPairSync, publicEncrypt, createPrivateKey, privateDecrypt } = require('crypto');

function generateKey(size = 32, format = 'base64') {
  const buffer = randomBytes(size);
  return buffer.toString(format);
}

function generateEncryption(passphrase) {
  const { privateKey, publicKey } = generateKeyPairSync('rsa', {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
      cipher: 'aes-256-cbc',
      passphrase 
    }
  })
  return { publicKey, encryptedPrivateKey: privateKey }
}

module.exports = { generateKey, generateEncryption }
