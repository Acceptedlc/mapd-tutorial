let exampleVega = {
  width: 384,
  height: 564,
  data: [
    {
      name: "poi",
      sql: "select ST_X(pt) as x,ST_Y(pt) as y  from poi"
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
        40.01,
        39.80
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
          value: 3
        }
      }
    }
  ]
};


function init() {
  var conn = new MapdCon()
    .protocol("http")
    .host('172.16.1.2')
    .port('9090')
    .dbName("mapd")
    .user("mapd")
    .password("HyperInteractive")
    .connect(function (error, con) {

      console.log("fuck");

      // con.renderVega(1, JSON.stringify(exampleVega), vegaOptions, function(error, result) {
      //   if (error) {
      //     console.log(error.message);
      //   }
      //   else {
      //     var blobUrl = `data:image/png;base64,${result.image}`
      //     var body = document.querySelector('body')
      //     var vegaImg = new Image()
      //     vegaImg.src = blobUrl
      //     body.append(vegaImg)
      //   }
      // });


    });
}