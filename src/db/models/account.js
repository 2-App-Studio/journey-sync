const mongoose = require("mongoose");
const { generateKey } = require('../../helper/crypto')

const accountSchema = new mongoose.Schema({
  displayName: { type: String, required: true },
  username: { 
    type: String,
    required: true, 
    validate: {
      validator: async function(username) {
        const account = await this.constructor.findOne({ username });
        if(account) {
          if(this.id === account.id) {
            return true;
          }
          return false;
        }
        return true;
      },
      message: props => 'The specified username is already in use.'
    }, 
  },
  isAdmin: { type: Boolean, default: false },
  apiKey: { type: String, default: () => generateKey() },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  encryption: { 
    encryptedPrivateKey: String,
    publicKey: String,
  },
  entriesCount: { type: Number, default: 0 },
  storageSize: { type: Number, default: 0 }
})

const Account = mongoose.model('Account', accountSchema)
module.exports = Account
