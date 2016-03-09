'use strict';

let fs       = require('fs');
let gameboy  = require('gameboy');
let Canvas   = require('canvas');
let canvas   = new Canvas(160, 144);

fs.readFile('/home/michael/Downloads/Pokemon Yellow.gb', function(err, rom) {
  let game = gameboy(canvas, rom, { drawEvents: true });

  game.stopEmulator = 1;
  setInterval(game.run.bind(game), 8);
  game.on('draw', function() {
    canvas.toBuffer(function(err, buff) {
      if (err) throw err;
      let encoded = buff.toString('base64');
      console.log(encoded);
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
