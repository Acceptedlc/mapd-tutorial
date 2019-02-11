const {ConsumerGroupPipeline} = require('kafka-pipeline');


const consumerPipeline = new ConsumerGroupPipeline({
  topic: 'iot-prod',
  messageConsumer: async (message) => {
    // await new Promise(suc => setTimeout(() => {
    //   console.log("kkkkkk");
    //   suc();
    // }, 1000));
    console.log("kkk")
  },

  failedMessageConsumer: async (exception, message) => {
    console.error(exception);
  },
  consumeConcurrency: 1,
  consumeTimeout: 5000,
  commitInterval: 100000,
  consumerGroupOption: {
    groupId: 'mapd-test',
    kafkaHost: '172.22.6.7:9092'
  }
});

consumerPipeline.start();
