var kafka = require('kafka-node');



// const client = new kafka.KafkaClient({kafkaHost: '172.22.6.7:9092'});
// const admin = new kafka.Admin(client);
// admin.listTopics((err, res) => {
//   console.log(res[1]);
// });




var options = {
  kafkaHost: '172.22.6.7:9092',
  groupId: 'mapd-test',
  sessionTimeout: 15000,
  protocol: ['roundrobin'],
  encoding: 'utf8',

  fromOffset: 'latest', // default
  commitOffsetsOnFirstJoin: true,
  outOfRangeOffset: 'earliest', // default
  migrateHLC: false,
  migrateRolling: true,
};



var consumerGroup = new kafka.ConsumerGroup(options, 'iot-prod');
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
    consumerGroup.on('connect', function () {
      console.log("connect success");
      consumerGroup.on('message', function (message) {
        con.query(`INSERT INTO logs VALUES ('${Math.floor(Date.now() / 1000)}', '${JSON.stringify(message.value)}');`, {}, function (err, result) {
          if(err) {
            console.log(`INSERT INTO logs VALUES ('${Math.floor(Date.now() / 1000)}', '${JSON.stringify(message.value)}');`);
            console.log(err);
            process.exit(1);
          }
        });
      });

    });
  });





/**
 * create table
 * inster table
 */


// commitOffsetsOnFirstJoin: true, // on the very first time this consumer group subscribes to a topic, record the offset returned in fromOffset (latest/earliest)
// how to recover from OutOfRangeOffset error (where save offset is past server retention) accepts same value as fromOffset

// consumerGroup.on('error', function (err) {
//   console.log(err)
// });
// 983381645


















// var kafka = require('kafka-node'),
//   Consumer = kafka.Consumer,
//   client = new kafka.KafkaClient({kafkaHost: '172.22.6.7:9092'}),
//   consumer = new Consumer(
//     client,
//     [
//       {offset: 0, topic: 'iot-prod', partition: 0},
//       {offset: 0, topic: 'iot-prod', partition: 1},
//       {offset: 0, topic: 'iot-prod', partition: 2},
//       {offset: 0, topic: 'iot-prod', partition: 3},
//       {offset: 0, topic: 'iot-prod', partition: 4},
//       {offset: 0, topic: 'iot-prod', partition: 5},
//       {offset: 0, topic: 'iot-prod', partition: 6},
//       {offset: 0, topic: 'iot-prod', partition: 7},
//       {offset: 0, topic: 'iot-prod', partition: 8},
//       {offset: 0, topic: 'iot-prod', partition: 9},
//       {offset: 0, topic: 'iot-prod', partition: 10},
//       {offset: 0, topic: 'iot-prod', partition: 11},
//     ],
//     {
//       autoCommit: true,
//       groupId: 'com',
//       fetchMaxWaitMs: 100,
//       fetchMinBytes: 1,
//     }
//   );
// consumer.on('message', function (message) {
//   console.log(message);
// });
//
// consumer.on('error', function (err) {
//   console.log(err)
// });