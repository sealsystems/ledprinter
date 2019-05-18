'use strict';

const net = require('net');

const Blinkt = require('node-blinkt');
const processEnv = require('processenv');

const leds = new Blinkt();
const port = processEnv('PORT') || 9100;

const shutdown = function () {
  /* eslint-disable no-console */
  console.log('Turning off lights.');
  /* eslint-enable no-console */

  leds.setAllPixels(0, 0, 0, 0);
  leds.sendUpdate();
  leds.sendUpdate();

  /* eslint-disable no-process-exit */
  process.nextTick(() => {
    /* eslint-disable no-console */
    console.log('Terminating process.');
    /* eslint-enable no-console */
    process.exit(0);
  });
  /* eslint-enable no-process-exit */
};

const init = function () {
  leds.setup();
  leds.clearAll();

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
  /* eslint-disable no-console */
  console.log('Initialized.');
  /* eslint-enable no-console */
};

const server = net.createServer((socket) => {
  /* eslint-disable no-console */
  socket.on('end', () => {
    console.log('Close socket');
    leds.setAllPixels(0, 0, 0, 0);
    leds.sendUpdate();
    leds.sendUpdate();
    socket.end();
  });

  socket.on('error', (err) => {
    console.log('Error:', err);
  });

  socket.on('data', () => {
    console.log('Receive data');
  });

  console.log('Open socket');
  leds.setAllPixels(255, 255, 0, 0.1);
  leds.sendUpdate();
  leds.sendUpdate();
});

init();
server.listen(port);
