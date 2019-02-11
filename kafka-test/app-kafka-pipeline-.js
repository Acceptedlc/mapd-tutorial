const {Consumer} = require('@sensoro/libkafka');
const Connector = require("../node-connector.js");


const connector = new Connector();
connector
  .protocol("http")
  .host('172.16.1.2')
  .port('9090')
  .dbName("mapd")
  .user("mapd")
  .password("HyperInteractive")
  .connect((err, con) => {
    console.log("connect mapd success");
    const consumerPipeline = new ConsumerGroupPipeline({
      topic: 'iot-prod',
      messageConsumer: async (message) => {

        await new Promise(suc => {
          let info = JSON.parse(message.value);
          let log = info.message.split('\n').map(e => e.split('|')[1]).join('').replace(/\'/g, `"`);
          con.query(`INSERT INTO logs VALUES ('${Math.floor(Date.now() / 1000)}', '${log}');`, {}, function (err, result) {
            if (err) {
              console.log(`INSERT INTO logs VALUES ('${Math.floor(Date.now() / 1000)}', '${JSON.stringify(message.value)}');`);
              console.log(err);
              process.exit(1);
            }
            suc();
          });
        });
      },

      failedMessageConsumer: async (exception, message) => {
        console.error(exception);
      },
      consumeConcurrency: 1,
      consumeTimeout: 5000,
      commitInterval: 5001,
      consumerGroupOption: {
        groupId: 'mapd-test',
        kafkaHost: '172.22.6.7:9092'
      }
    });

    consumerPipeline.start();
  });

