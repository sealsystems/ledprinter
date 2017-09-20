'use strict';

const crypto = require('crypto');
const events = require('events');
const net = require('net');
const util = require('util');

const EventEmitter = events.EventEmitter;

const SocketPrinterSimulator = function (options) {
  if (!options) {
    throw new Error('Options are missing.');
  }
  if (!options.port) {
    throw new Error('Port is missing.');
  }
  if (!options.maxConnections) {
    throw new Error('Number of maximum connections is missing.');
  }

  const that = this;

  EventEmitter.call(that);

  that.counter = 0;

  const server = net.createServer((socket) => {
    let content;
    const md5 = crypto.createHash('md5');

    const connection = { remotePort: socket.remotePort };

    that.emit('newconn', connection);

    socket.once('error', (err) => {
      connection.err = err;
      that.emit('error', connection);
    });

    socket.once('data', (data) => {
      content = data.toString('utf8').substring(0, 12);

      const positionOfNewline = content.indexOf('\n');

      if (positionOfNewline !== -1) {
        content = content.substring(0, positionOfNewline);
      }
    });

    md5.once('finish', () => {
      const hash = md5.read().toString('hex');

      that.counter++;
      connection.counter = that.counter;
      connection.hash = hash;
      that.emit('document', connection);
    });

    socket.pipe(md5);
  });

  server.maxConnections = options.maxConnections;

  server.listen(options.port);
};

util.inherits(SocketPrinterSimulator, EventEmitter);

module.exports = SocketPrinterSimulator;
