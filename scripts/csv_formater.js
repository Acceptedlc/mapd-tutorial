const es = require('event-stream');
const fs = require('fs');
const {Writable} = require('stream');
const stringify = require('csv-stringify')

class WriteCsvStream extends Writable {
  constructor(outputPath) {
    super();
    this.outputPath = outputPath;
    this.lines = 0;
  }

  _write(chunk, encoding, done) {
    let [time, lon, lat] = chunk.toString().split(',');
    console.log(this.lines);
    if(this.lines === 0) {
      fs.writeFile(this.outputPath, `pt, record_time, rowid\n`, {flag: "w"}, () => {
        this.lines++;
        done();
      });
    } else  {
      fs.writeFile(this.outputPath, `POINT(${lon} ${lat}), ${time}, ${this.lines}\n`, {flag: "a"}, () => {
        this.lines++;
        done();
      });
    }
  }
}


fs.createReadStream('/Users/chaoli/Desktop/log.csv')
  .pipe(es.split())
  .pipe(new WriteCsvStream("/tmp/fuck.csv"));

