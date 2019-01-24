const express = require("express");
const moment = require("moment");
const Connector = require("/Users/chaoli/Desktop/sensoro/mapd-connector/dist/node-connector.js");

let exampleVega = {
  width: 1024 * 2,
  height: 680 * 2,
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
          value: 4
        },
        opacity: 0.5
      }
    }
  ]
};

const app = express();
const connector = new Connector();


app.use(express.static(__dirname + '/static'));


const router = express.Router();


const startTime = '2019-01-20 16:00:00';
const endTime = '2019-01-21 15:59:58';


router.get("/image/:no", function (req, res) {
  let con = app.get("con");
  let no = parseInt(req.params.no) % 48;
  let start = moment(startTime).add(0.5 * no, "hours").format("YYYY-MM-DD HH:mm:ss");
  let end = moment(startTime).add(0.5 * (no + 1), "hours").format("YYYY-MM-DD HH:mm:ss");
  let sql = `select ST_X(posi) as x,ST_Y(posi) as y, ningbo.rowid, ABS(rssi) as rssi from ningbo where record_time > timestamp '${start}' and record_time < timestamp '${end}';`;
  exampleVega.data[0].sql = sql;
  con.renderVega(2, JSON.stringify(exampleVega), {compression: 3}, function (error, result) {
    if (error) {
      res.status(502);
      res.json({err: error});
    } else {
      res.set("Content-Type", "image/png");
      res.write(result.image);
      res.end();
    }
  });
});

router.get("/data/:no", function (req, res) {
  let con = app.get("con");
  let no = parseInt(req.params.no) % 48;
  let start = moment(startTime).add(0.5 * no, "hours").format("YYYY-MM-DD HH:mm:ss");
  let end = moment(startTime).add(0.5 * (no + 1), "hours").format("YYYY-MM-DD HH:mm:ss");
  let sql = `select count(1) as cnt from ningbo where record_time > timestamp '${start}' and record_time < timestamp '${end}';`;
  let options = {};
  con.query(sql, options, function (err, result) {
    res.json({start, end, num: parseInt("0X"+result[0].cnt.buffer.toString('hex'))});
  });
});

app.use(router);


connector
  .protocol("http")
  .host('172.16.1.2')
  .port('9090')
  .dbName("mapd")
  .user("mapd")
  .password("HyperInteractive")
  .connect(function (error, con) {
    app.set("con", con);
    app.listen(3333);
    console.log("start at 3333");
  });
