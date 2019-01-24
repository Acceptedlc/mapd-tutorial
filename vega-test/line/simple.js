const fs = require("fs");
const Connector = require("/Users/chaoli/Desktop/sensoro/mapd-connector/dist/node-connector.js");

let exampleVega = {
  "width": 1024,
  "height": 1024,
  "data": [
    {
      "name" : "lines",
      "values": [
        {"x": 412, "y": 512, "val": 0.9,"color": "red"},
        {"x": 512, "y": 512, "val": 0.3, "color": "violet"},
        {"x": 612, "y": 512, "val": 0.5,"color": "green"}
      ]
    }
  ],

  "marks": [
    {
      "type" : "points",  //
      "from" : {"data" : "table"},
      "properties" : {
        "x" : { "field" : "x" },
        "y" : { "field" : "y" },
        "strokeColor": {
          "scale": "strokeColor",
          "field": "color"
        },
        "fillColor" : {
          "field" : "color"
        },
        "size" : 180.0,
        "opacity" : 1,
      }
    }
  ]
};





const connector = new Connector();


connector
  .protocol("http")
  .host('172.16.1.2')
  .port('9090')
  .dbName("mapd")
  .user("mapd")
  .password("HyperInteractive")
  .connect(function (error, con) {


    con.renderVega(1, JSON.stringify(exampleVega), {compression: 3}, function(error, result) {
      if (error) {
        console.log(error);
      }
      else {
        fs.writeFileSync("/tmp/test.png", result.image);
        console.log("result in /tmp/test.png");
      }
    });


  });