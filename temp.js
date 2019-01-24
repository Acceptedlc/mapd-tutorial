const vegaSpec = {
  width: 1080,
  height: 1080,
  data: [
    {
      name: "geojson_test1",
      sql: "select mapd_geo as points from geojson_test1",
      format: {
        type: "lines",
        coords: {
          x: ["points"],
          y: [
            {from: "points"}
          ]
        },
        layout: "interleaved"
      }
    }
  ],
  projections: [
    {
      name: "projection",
      type: "mercator"
    }
  ],
  scales: [
    {
      name: "x",
      type: "linear",
      domain: [10, 200],
      range: "width"
    },
    {
      name: "y",
      type: "linear",
      domain: [10, 80],
      range: "height"
    },
  ],
  marks: [
    {
      type: "lines",
      from: {data: "geojson_test1"},
      properties: {
        x: {
          scale: "x",
          field: "x"
        },
        y: {
          scale: "y",
          field: "y"
        }
      },
      opacity: 1,
      strokeColor: "red",
      strokeWidth: 20
    }
  ]
};

console.log(JSON.stringify(vegaSpec, null, 2));