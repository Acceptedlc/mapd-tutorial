const fs = require("fs");
const Connector = require("/Users/chaoli/Desktop/sensoro/mapd-connector/dist/node-connector.js");

let exampleVega = {
  width: 1024,
  height: 1024,
  data: [
    {
      name: "poi",
      sql: "select ST_X(pt) as x,ST_Y(pt) as y, poi.rowid  from poi;"
    }
  ],
  scales: [
    {
      name: "x",
      type: "linear",
      domain: [
        116.20,
        116.61
      ],
      range: "width"
    },
    {
      name: "y",
      type: "linear",
      domain: [
        39.80,
        40.01
      ],
      range: "height"
    }
  ],
  marks: [
    {
      type: "points",
      from: {
        data: "poi"
      },
      properties: {
        x: {
          scale: "x",
          field: "x"
        },
        y: {
          scale: "y",
          field: "y"
        },
        "fillColor": "blue",
        size: {
          value: 1
        }
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