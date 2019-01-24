const Connector = require("/Users/chaoli/Desktop/sensoro/mapd-connector/dist/node-connector.js");
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


    let query = "select count(1) as cnt from poi limit 1";
    let options = {};

    con.query(query, options, function (err, result) {
      console.log(parseInt("0X"+result[0].cnt.buffer.toString('hex')));
      console.log(err);
    });



  });


