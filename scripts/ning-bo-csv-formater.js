const es = require('event-stream');
const fs = require('fs');
const {Writable} = require('stream');
const moment = require('moment');


class WriteCsvStream extends Writable {
  constructor(outputPath) {
    super();
    this.outputPath = outputPath;
    this.lines = 0;
  }

  _write(chunk, encoding, done) {
    if (this.lines === 0) {
      let [time, EUI, posi, rssi, snr] = chunk.toString().split(',');
      fs.writeFileSync(this.outputPath, `record_time, EUI, posi, rssi, snr\n`, {flag: "w"});
    } else {
      let time = chunk.toString().split(',')[0];
      time = parseInt(time / 1000);
      let EUI = chunk.toString().split(',')[1];

      let posi = chunk.toString().split(',')[2] + ", " + chunk.toString().split(',')[3];
      posi = JSON.parse(posi);
      posi = JSON.parse(posi);
      posi = `POINT(${posi[0]} ${posi[1]})`;
      let rssi = chunk.toString().split(',')[4];
      let snr = chunk.toString().split(',')[5];
      // console.log(time);
      // console.log(EUI);
      // console.log(posi);
      // console.log(rssi);
      // console.log(snr);
      fs.writeFileSync(this.outputPath, `${time}, ${EUI}, ${posi}, ${rssi}, ${snr}\n`, {flag: "a"});
    }
    console.log(this.lines);
    this.lines++;
    done();
  }
}


fs.createReadStream('/Users/chaoli/Desktop/ningbo-data-15160.csv')
  .pipe(es.split())
  .pipe(new WriteCsvStream("/tmp/ningbo.csv"));