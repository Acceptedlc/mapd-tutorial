const {Consumer} = require('@sensoro/libkafka');

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
    console.log(message);
  },
  // 可选的消费失败的消息处理函数, 当 messageConsumer 发生异常或消费超时时调用
  failedMessageConsumer: async (error, message) => {
    console.error(error);
    await FailedMessage.insert(message);
  }
});
consumer.listen(); // 返回一个Promise，将一直阻塞直至close()方法被调用
