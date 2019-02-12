const {Consumer} = require('@sensoro/libkafka');
const Connector = require("../node-connector.js");

let index = 1;
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
    const consumer = new Consumer({
      kafkaHost: '172.22.6.7:9092',
      // or you can specify a zookeeperUri
      // zookeeperUri: 'zookeeper-01:2181,zookeeper-02:2181,zookeeper-03:2181/path/to/kafka'
      groupId: 'mapd-test',
      topic: 'iot-prod',

      // 消费3秒不结束认为超时，可选
      consumeTimeout: 3000,

      // 最多并发消费16条，可选
      maxConsumeConcurrency: 16,


      // 消息处理回调函数
      messageConsumer: async (message) => {
        console.log("recieve message", index++);
        let info = JSON.parse(message.value);
        let log = info.message.split('\n').map(e => e.split('|')[1]).join('').replace(/\'/g, `"`).substr(0, 100);

        // await new Promise()

        con.query(`INSERT INTO logs VALUES ('${Math.floor(Date.now() / 1000)}', '${log}');`, {}, function (err, result) {
          if (err) {
            console.log(`INSERT INTO logs VALUES ('${Math.floor(Date.now() / 1000)}', '${JSON.stringify(message.value)}');`);
            console.log(err);
            process.exit(1);
          }
        });
      },
      // 可选的消费失败的消息处理函数, 当 messageConsumer 发生异常或消费超时时调用
      failedMessageConsumer: async (error, message) => {
        console.error(error);
      }
    });
    consumer.listen();
  });

