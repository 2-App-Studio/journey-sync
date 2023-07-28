const { Client } = require("@elastic/elasticsearch");
require("dotenv").config();
const elasticUrl = process.env.ELASTIC_URL || "http://localhost:9200";
const esclient = new Client({ 
  node: elasticUrl,
  auth: {
    username: "elastic",
    password: process.env.ELASTIC_PASSWORD || "changeme",
  },
});
const index = "entries";
const type = "entry";
/**
 * @function createIndex
 * @returns {void}
 * @description Creates an index in ElasticSearch.
 */
async function createIndex(index) {
  try {
    await esclient.indices.create({ index });
    console.log(`Created index ${index}`);
  } catch (err) {
    console.error(`An error occurred while creating the index ${index}:`);
    console.error(err);
  }
}
/**
 * @function setEntriesMapping,
 * @returns {void}
 * @description Sets the entries mapping to the database.
 */
async function setEntriesMapping() {
  try {
    const schema = {
      entry: {
        type: "text"
      }
    };

    await esclient.indices.putMapping({
      index,
      type,
      body: {
        properties: schema
      }
    })

    console.log("Entries mapping created successfully");

  } catch (err) {
    console.error("An error occurred while setting the entries mapping:");
    console.error(err);
  }
}
/**
 * @function checkConnection
 * @returns {Promise<Boolean>}
 * @description Checks if the client is connected to ElasticSearch
 */
function checkConnection() {
  return new Promise(async (resolve) => {
    console.log("Checking connection to ElasticSearch...");
    let isConnected = false;
    while (!isConnected) {
      try {
        await esclient.cluster.health({});
        console.log("Successfully connected to ElasticSearch");
        isConnected = true;
        // eslint-disable-next-line no-empty
      } catch (_) {
        console.log(_)
        console.log(elasticUrl)
        console.log(process.env.ELASTIC_PASSWORD || "changeme")
      }
    }
    resolve(true);
  });
}
module.exports = {
  esclient,
  setEntriesMapping,
  checkConnection,
  createIndex,
  index,
  type
};
