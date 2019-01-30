const express = require("express");
const moment = require("moment");
const sphericalMercator = require("@mapbox/sphericalmercator");
const Connector = require("/Users/chaoli/Desktop/sensoro/mapd-connector/dist/node-connector.js");

const app = express();
const connector = new Connector();


const merc = new sphericalMercator({
  size: 256
});

app.use(express.static(__dirname + '/static'));

const router = express.Router();

const startTime = '2019-01-20 16:00:00';
const endTime = '2019-01-21 15:59:58';


let getSingal = {
  width: 256,
  height: 256,
  data: [
    {
      name: "ningbo",
      sql: "select distinct EUI, ABS(rssi) as rssi, ningbo.rowid, conv_4326_900913_x(ST_X(posi)) as x, conv_4326_900913_y(ST_Y(posi)) as y from ningbo where record_time > timestamp '2019-01-20 16:00:00' and record_time < timestamp '2019-01-20 16:30:00';"
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
        13505505.65365122,
        13506728.646103784
      ],
      range: "width"
    },
    {
      name: "y",
      type: "linear",
      domain: [
        3527110.2331911735,
        3528333.2256437363
      ],
      range: "height"
    }
  ],
  marks: [
    {
      type: "symbol",
      from: {
        data: "ningbo"
      },
      properties: {
        shape: "square",
        x: {
          scale: "x",
          field: "x"
        },
        y: {
          scale: "y",
          field: "y"
        },
        width: 5,
        height: 5,
        fillColor: '#BE5DAC',
        stroke: '#BE5DAC'
        // strokeWidth: 0,
        // strokeOpacity: 0
      }
    }
  ]
};


let allDevice = {
  width: 256,
  height: 256,
  data: [
    {
      name: "ningbo-all",
      sql: "select distinct EUI, ABS(rssi) as rssi, ningbo.rowid, conv_4326_900913_x(ST_X(posi)) as x, conv_4326_900913_y(ST_Y(posi)) as y from ningbo;"
    }
  ],
  scales: [
    {
      name: "x",
      type: "linear",
      domain: [
        13505505.65365122,
        13506728.646103784
      ],
      range: "width"
    },
    {
      name: "y",
      type: "linear",
      domain: [
        3527110.2331911735,
        3528333.2256437363
      ],
      range: "height"
    }
  ],
  marks: [
    {
      type: "symbol",
      from: {
        data: "ningbo-all"
      },
      properties: {
        shape: "square",
        x: {
          scale: "x",
          field: "x"
        },
        y: {
          scale: "y",
          field: "y"
        },
        width: 5,
        height: 5,
        fillColor: '#A39E8E',
        stroke: '#A39E8E'
      }
    }
  ]
};


router.get("/image-all/:z/:x/:y", function (req, res) {
  let x = parseInt(req.params.x);
  let y = parseInt(req.params.y);
  let z = parseInt(req.params.z);

  let [beginX, beginY, endX, endY] = merc.bbox(x, y, z, false, "900913");
  allDevice.scales[0].domain = [beginX, endX];
  allDevice.scales[1].domain = [beginY, endY];
  allDevice.marks[0].properties.width = z - 9 > 4 ? z - 9 : 4;
  allDevice.marks[0].properties.height = z - 9 > 4 ? z - 9 : 4;
  let con = app.get("con");
  con.renderVega(z+100, JSON.stringify(allDevice), {compression: 3}, function (error, result) {
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

//15/27427/13499
router.get("/image/:z/:x/:y", function (req, res) {
  let x = parseInt(req.params.x);
  let y = parseInt(req.params.y);
  let z = parseInt(req.params.z);


  console.log(req.query);
  let no = parseInt(req.query.no) % 144;


  let start = moment(startTime).add(0.1 * no, "hours").format("YYYY-MM-DD HH:mm:ss");;
  let end = moment(startTime).add(0.1 * (no + 1), "hours").format("YYYY-MM-DD HH:mm:ss");
  console.log(start);
  console.log(end);


  let [beginX, beginY, endX, endY] = merc.bbox(x, y, z, false, "900913");
  getSingal.data[0].sql = `select distinct EUI, ABS(rssi) as rssi, ningbo.rowid, conv_4326_900913_x(ST_X(posi)) as x, conv_4326_900913_y(ST_Y(posi)) as y from ningbo where record_time > timestamp '${start}' and record_time < timestamp '${end}';`;
  getSingal.scales[1].domain = [beginX, endX];
  getSingal.scales[2].domain = [beginY, endY];
  getSingal.marks[0].properties.width = z - 9 > 4 ? z - 9 : 4;
  getSingal.marks[0].properties.height = z - 9 > 4 ? z - 9 : 4;
  console.log(x, y, z, getSingal.marks[0].properties.height);
  console.log(getSingal.data[0].sql);
  let con = app.get("con");
  con.renderVega(z, JSON.stringify(getSingal), {compression: 3}, function (error, result) {
    if (error) {
      res.status(502);
      res.json({err: error});
    } else {
      res.set("Content-Type", "image/png");
      res.write(result.image);
      res.end();
    }
  });

  console.log(`select count(1) from ningbo where conv_4326_900913_x(ST_X(posi)) > ${beginX} and conv_4326_900913_x(ST_X(posi)) < ${endX} and conv_4326_900913_y(ST_Y(posi)) > ${beginY} and conv_4326_900913_y(ST_Y(posi)) < ${endY};`);
  // res.json({beginX, beginY, endX, endY, polygonStr: formatPolygonByBbox(beginX, beginY, endX, endY)});
});


let formatPolygonByBbox = function (beginX, beginY, endX, endY) {
  let upLeft = [beginX, endY].join(' ');
  let upRight = [endX, endY].join(' ');
  let downRight = [endX, beginY].join(' ');
  let downLeft = [beginX, beginY].join(' ');
  return `POLYGON((${upLeft}, ${upRight}, ${downRight}, ${downLeft}, ${upLeft}))`;
};

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
    app.listen(3334);
    console.log("start at 3334");
  });