const Connector = require("../node-connector.js");
// const Connector = require("mapd-connector");


const connector = new Connector();


connector
  .protocol("http")
  .host('172.16.1.2')
  .port('9090')
  .dbName("mapd")
  .user("mapd")
  .password("HyperInteractive")
  .connect((err, con) => {


    let query = "INSERT INTO logs VALUES ('1548822549', '\"{\\\"@timestamp\\\":\\\"2019-01-30T04:09:19.585Z\\\",\\\"@metadata\\\":{\\\"beat\\\":\\\"filebeat\\\",\\\"type\\\":\\\"doc\\\",\\\"version\\\":\\\"6.4.0\\\",\\\"topic\\\":\\\"iot-prod\\\"},\\\"beat\\\":{\\\"hostname\\\":\\\"daemonset-node-filebeat-6sv87\\\",\\\"version\\\":\\\"6.4.0\\\",\\\"name\\\":\\\"daemonset-node-filebeat-6sv87\\\"},\\\"host\\\":{\\\"name\\\":\\\"daemonset-node-filebeat-6sv87\\\"},\\\"message\\\":\\\"+ 2019-01-30T04:09:19.584Z  info \\\u003ckafka-consumer\\\u003e - | Message of topic ns-anylasis-production consumed within 15 ms, msgId: 5c51236f23e430000aa7a44e\\\",\\\"kubernetes-env\\\":\\\"iot-prod\\\",\\\"kubernetes\\\":{\\\"namespace\\\":\\\"alpha\\\",\\\"replicaset\\\":{},\\\"labels\\\":{\\\"app\\\":\\\"alpha-cloud-api\\\"},\\\"pod\\\":{\\\"name\\\":\\\"alpha-cloud-api-5bcc958f5b-5mjnz\\\"},\\\"node\\\":{\\\"name\\\":\\\"iot-prod-kubernetes-node-15\\\"},\\\"container\\\":{\\\"name\\\":\\\"alpha-cloud-api\\\"}}}\"');";
    let options = {};

    con.query(query, options, function (err, result) {
      console.log(result);
      // console.log(parseInt("0X"+result[0].cnt.buffer.toString('hex')));
      // console.log(err);
    });



  });


