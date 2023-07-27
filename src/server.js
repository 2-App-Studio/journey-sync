const express = require('express')
const bodyParser = require('body-parser')
const { Entry, Account } = require('./db/models')
const { spawn } = require('child_process')
const { sendData } = require('./rabbitmq')
const { accounts, entries } = require('./routes')
const { requireApiKey } = require('./middlewares/auth')
const { errorHandler } = require('./middlewares/error')
require('dotenv').config()

require('./db')

// Constants
const PORT = process.env.PORT
const HOST = '0.0.0.0'

// App
const app = express()
const jsonParser = bodyParser.json()
const urlencodedParser = bodyParser.urlencoded({ extended: false })


function start() {

  app.use(jsonParser)
  app.use(urlencodedParser)
  app.use('/accounts', accounts)
  app.use(requireApiKey)
  
  app.use('/entries', entries)
  app.get('/', async (req, res) => {
    const entries = await Entry.find({});
    try {
      res.send(entries);
    } catch (error) {
      res.status(500).send(error);
    }
  })

  app.get('/ffmpeg', async (req, res) => {
    const code = await new Promise((resolve, reject) => {
      const command = 'ffmpeg'
      const args = ['-version']
      const ffmpeg = spawn(command, args) // <1>

      ffmpeg.stdout.pipe(process.stdout) // <2>
      ffmpeg.stderr.pipe(process.stderr)

      ffmpeg.on('exit', code => { // <3>
        resolve(code)
      })

      ffmpeg.on('error', err => { // <4>
        reject(err)
      })
    })

    res.status(200).send(`ffmpeg exit: code = ${code}`) // <5>
  })

  app.get('/rabbitmq', async (req, res) => {
    await sendData('hello!')
    res.send(200)
  })

  // Add a new document to the collection
  app.post("/", async (req, res) => {
    const entry = new Entry(req.body);
    try {
      await entry.save();
      res.send(entry);
    } catch (error) {
      res.status(500).send(error);
    }
  })
  
  app.use(errorHandler)

  app.listen(PORT, HOST, () => {
    console.log(`Running on http://${HOST}:${PORT}`)
  })
}

module.exports = { start }

