'use strict';

const Blinkt = require('node-blinkt');

const pad = require('pad');
const processEnv = require('processenv');

const PrinterSimulator = require('../lib/PrinterSimulator');

const leds = new Blinkt();
let connections = [];

let documentsReceived = 0, documentsReceivedErrors = 0;

const init = function () {
  leds.setup();
  leds.clearAll();

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
  console.log('Initialized.');
};

const shutdown = function () {
  console.log('Turning off lights.');

  leds.setAllPixels(0, 0, 0, 0);
  leds.sendUpdate();
  leds.sendUpdate();

  /* eslint-disable no-process-exit */
  process.nextTick(() => {
    console.log('Terminating process.');
    process.exit(0);
  });
  /* eslint-enable no-process-exit */
};

init();

const color = function (conn) {
  conn.animation++;

  if (conn.mode === 'up') {
    if (conn.animation > 10) {
      conn.mode = 'running';
    }
    return [0, 255, 0, conn.animation * 0.08];
  } else if (conn.mode === 'down') {
    if (conn.animation > 10) {
      conn.mode = 'remove';
    }
    return [255, 0, 0, (11 - conn.animation) * 0.08];
  } else {
    return [255, 255, 0, 0.1];
  }
};

setInterval(() => {
  leds.setAllPixels(0, 0, 0, 0);
  let i = 7;
  connections.forEach((conn) => {
    const col = color(conn);
    if (i > -1) {
      leds.setPixel(i--, col[0], col[1], col[2], col[3]);
    }
  });

  leds.sendUpdate();

  connections = connections.filter((item) => {
    return item.mode !== 'remove';
  });
}, 1000 / 30);

const printerSimulator = new PrinterSimulator({
  port: processEnv('PORT') || 9100,
  protocol: processEnv('PROTOCOL') || 'Socket',
  maxConnections: processEnv('MAX_CONNECTIONS') || 1
});

printerSimulator.on('newconn', (conn) => {
  conn.mode = 'up';
  conn.animation = 0;
  console.log('new connection', conn);
  connections.push(conn);
  connections.push(conn);
  connections.push(conn);
  connections.push(conn);
  connections.push(conn);
  connections.push(conn);
  connections.push(conn);
  connections.push(conn);
});

printerSimulator.on('document', (conn) => {
  conn.mode = 'down';
  conn.animation = 0;
  console.log('document', conn);
  const found = connections.find((item) => {
    return item.remotePort === conn.remotePort;
  });
  console.log('connection finished', conn);
});

printerSimulator.on('error', (conn) => {
  console.log('connection error', conn);
});
