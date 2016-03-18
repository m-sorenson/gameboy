'use strict';

let fs       = require('fs');
let gameboy  = require('gameboy');
let Canvas   = require('canvas');
let canvas   = new Canvas(160, 144);
let imagemin = require('imagemin');

if (process.argv.length < 3) {
  throw new Error('Must supply path to ROM.')
} else {
  fs.readFile(process.argv[2], function(err, rom) {
    let game = gameboy(canvas, rom, { drawEvents: true });

    game.stopEmulator = 1;
    setInterval(game.run.bind(game), 10);
    game.on('draw', function() {
      canvas.toBuffer(function(err, buff) {
        if (err) throw err;

        imagemin()
          .src(buff)
          .use(imagemin.optipng({optimizationLevel: 0}))
          .run(function (err, files) {
            if (err) throw err;
            console.log(files[0].contents.toString('base64'))
          })
      });
    });

    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', function(move) {
      move = move.trim()
      game.JoyPadEvent(move, true);
      setTimeout(function() {
        game.JoyPadEvent(move, false)
      }, 50);
    });
    game.start();
  });
}
