const fs = require("fs");
const Connector = require("/Users/chaoli/Desktop/sensoro/mapd-connector/dist/node-connector.js");

let exampleVega = {
  width: 1024,
  height: 1024,
  data: [
    {
      name: "ningbo",
      sql: "select ST_X(posi) as x,ST_Y(posi) as y, ningbo.rowid, ABS(rssi) as rssi from ningbo where record_time > timestamp '2019-01-20 17:00:00' and record_time < timestamp '2019-01-20 18:00:00';"
    }
  ],
  scales: [
    {
      name: "color",
      type: "quantize",
      domain: [0, 127],
      range: [
        '#18a356',
        '#18a356',
        '#18a356',
        '#18a356',
        '#ffccc7',
        '#ffa39e',
        '#ff7875',
        '#ff4d4f',
        '#f5222d',
        '#8c8c8c'
      ]
    },
    {
      name: "x",
      type: "linear",
      domain: [
        121.18044999200744,
        121.41751447339416
      ],
      range: "width"
    },
    {
      name: "y",
      type: "linear",
      domain: [
        30.26365,
        30.1689
      ],
      range: "height"
    }
  ],
  marks: [
    {
      type: "points",
      from: {
        data: "ningbo"
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
        fillColor: {
          scale: "color",
          field: "rssi"
        },
        size: {
          value: 5
        },
        opacity: 0.6
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


    con.renderVega(1, JSON.stringify(exampleVega), {compression: 3}, function (error, result) {
      if (error) {
        console.log(error);
      } else {
        fs.writeFileSync("/tmp/test.png", result.image);
        console.log("result in /tmp/test.png");
      }
    });


  });