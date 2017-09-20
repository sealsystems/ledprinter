'use strict';

const events = require('events');
const util = require('util');

const EventEmitter = events.EventEmitter;

const protocols = {
  Socket: require('./SocketPrinterSimulator')
};

const PrinterSimulator = function (options) {
  if (!options) {
    throw new Error('Options are missing.');
  }
  if (!options.port) {
    throw new Error('Port is missing.');
  }
  if (!options.protocol) {
    throw new Error('Protocol is missing.');
  }
  if (!options.maxConnections) {
    throw new Error('Number of maximum connections is missing.');
  }

  if (!protocols[options.protocol]) {
    throw new Error('Invalid protocol.');
  }

  const that = this;

  EventEmitter.call(that);

  const simulator = new protocols[options.protocol](options);

  simulator
    .on('newconn', (conn) => {
      that.emit('newconn', conn);
    })
    .on('document', (document) => {
      that.emit('document', document);
    })
    .on('error', (err) => {
      that.emit('error', err);
    });
};

util.inherits(PrinterSimulator, EventEmitter);

module.exports = PrinterSimulator;
