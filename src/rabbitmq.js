const amqp = require('amqplib')

var channel, connection;  //global variables

async function connectQueue() {
  try {
    connection = await amqp.connect(process.env.RABBITMQ_URL);
    channel = await connection.createChannel()

    await channel.assertQueue("test-queue")

  } catch (error) {
    console.log(error)
  }
}
async function sendData (data) {
    // send data to queue
    await channel.sendToQueue("test-queue", Buffer.from(JSON.stringify(data)));
        
    // close the channel and connection
    await channel.close();
    await connection.close(); 
}

module.exports = { connectQueue, sendData }
