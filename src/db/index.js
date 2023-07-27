const mongoose = require("mongoose");
const { Account } = require('./models')

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
        await seedDb()
        console.log('Database connection successful');
      })
      .catch((err) => {
        console.error('Database connection failed');
      });
  }
}

const seedAccounts = [
  {
    username: "admin",
    displayName: "Admin",
    isAdmin: true,
  }

]
const seedDb = async () => {
  try {
    await Account.insertMany(seedAccounts)
  } catch {
    // silently fail
  }
}

module.exports = new Database();
