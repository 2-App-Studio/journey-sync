const mongoose = require("mongoose");
const inquirer = require('inquirer')
const { Account } = require('./models')
const { generateEncryption } = require('../helper/crypto')


const connectionString = process.env.MONGO_DB_URI || ''
const databaseName = process.env.MONGO_DB_NAME || 'journey-db'

class Database {
  constructor() {
    this._connect();
  }
  _connect() {
    mongoose
      .connect(`${connectionString}/${databaseName}`)
      .then(async () => {
        console.log('Database connection successful');
        if (await mongoose.connection.db.collection('accounts').count() === 0) {
          await setup()
        }
      })
      .catch((err) => {
        console.log(err)
        console.error('Database connection failed');
      });
  }
}

const adminAccount = {
  username: "admin",
  displayName: "Admin",
  isAdmin: true,
}
const setup = async () => {
  await inquirer.prompt(questions).then(async (answers) => {
    if (answers.displayName) {
      adminAccount.displayName = answers.displayName
    }
    if (answers.e2ee === 'yes') {
      adminAccount.encryption = generateEncryption(answers.passphrase)
    } else {
      adminAccount.encryption = null
    }
    const createdAccount = await new Account(adminAccount).save()
    console.log('Successfully created account')
    console.log(`Your API key is: ${createdAccount.apiKey}`)
  })
}

const questions = [
  {
    type: 'input',
    name: 'displayName',
    message: 'Please choose a Display Name for your account',
  },
  {
    type: 'list',
    name: 'e2ee',
    message: 'Would you like to enable End-to-end Encryption?',
    choices: ['Yes', 'No'],
    filter(val) {
      return val.toLowerCase();
    },
  },
  {
    type: 'input',
    name: 'passphrase',
    message: 'Please enter a secure passphrase to encrypt your account',
    when(answers) {
      return answers.e2ee === 'yes'
    },
  },
]
module.exports = new Database();
