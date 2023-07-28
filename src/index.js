const elastic = require("./elastic")
const { connectQueue } = require('./rabbitmq')

require("dotenv").config();

(async function main() {

  // Connect to RabbitMQ
  await connectQueue()

  // Connect to ElasticSearch
  const isElasticReady = await elastic.checkConnection()
  if (isElasticReady) {
    const elasticIndex = await elastic.esclient.indices.exists({index: elastic.index})
    if (!elasticIndex) {
      await elastic.createIndex(elastic.index)
      await elastic.setEntriesMapping()
    }

    const server  = require("./server")
    server.start()
  }
})()
