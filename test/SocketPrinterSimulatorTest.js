// 'use strict';
//
// const events = require('events');
// const net = require('net');
//
// const assert = require('assertthat');
//
// const SocketPrinterSimulator = require('../lib/SocketPrinterSimulator');
//
// const EventEmitter = events.EventEmitter;
//
// suite('SocketPrinterSimulator', () => {
//   let socketPrinterSimulator;
//
//   suiteSetup((done) => {
//     socketPrinterSimulator = new SocketPrinterSimulator(
//       { port: 9100, type: 'Socket', maxConnections: 1 });
//     done();
//   });
//
//   test('is a function.', (done) => {
//     assert.that(SocketPrinterSimulator).is.ofType('function');
//     done();
//   });
//
//   test('throws an error if options are missing.', (done) => {
//     assert.that(() => {
//       /* eslint-disable no-new */
//       new SocketPrinterSimulator();
//       /* eslint-enable no-new */
//     }).is.throwing('Options are missing.');
//     done();
//   });
//
//   test('throws an error if the port is missing.', (done) => {
//     assert.that(() => {
//       /* eslint-disable no-new */
//       new SocketPrinterSimulator({ maxConnections: 1 });
//       /* eslint-enable no-new */
//     }).is.throwing('Port is missing.');
//     done();
//   });
//
//   test('throws an error if the number of maximum connections is missing.', (done) => {
//     assert.that(() => {
//       /* eslint-disable no-new */
//       new SocketPrinterSimulator({ port: 9100 });
//       /* eslint-enable no-new */
//     }).is.throwing('Number of maximum connections is missing.');
//     done();
//   });
//
//   test('returns an event emitter.', (done) => {
//     assert.that(socketPrinterSimulator).is.instanceOf(EventEmitter);
//     done();
//   });
//
//   test('raises a document event when a document is received.', (done) => {
//     socketPrinterSimulator.once('document', () => {
//       done();
//     });
//
//     /* eslint-disable newline-after-var */
//     const client = net.connect(9100, () => {
//     /* eslint-enable newline-after-var */
//       client.write('foobar');
//       client.end();
//     });
//   });
//
//   test('provides the content within the document event.', (done) => {
//     socketPrinterSimulator.once('document', (document) => {
//       assert.that(document.content).is.equalTo('foobar');
//       done();
//     });
//
//     /* eslint-disable newline-after-var */
//     const client = net.connect(9100, () => {
//     /* eslint-enable newline-after-var */
//       client.write('foobar');
//       client.end();
//     });
//   });
//
//   test('provides only the first 32 bytes of the content within the document event.', (done) => {
//     socketPrinterSimulator.once('document', (document) => {
//       assert.that(document.content).is.equalTo('foobarfoobar');
//       done();
//     });
//
//     /* eslint-disable newline-after-var */
//     const client = net.connect(9100, () => {
//     /* eslint-enable newline-after-var */
//       client.write('foobarfoobarfoobarfoobarfoobarfoobar');
//       client.end();
//     });
//   });
//
//   test('provides less than 32 bytes if there is a newline within the content.', (done) => {
//     socketPrinterSimulator.once('document', (document) => {
//       assert.that(document.content).is.equalTo('foobar');
//       done();
//     });
//
//     /* eslint-disable newline-after-var */
//     const client = net.connect(9100, () => {
//     /* eslint-enable newline-after-var */
//       client.write('foobar\nfoobar');
//       client.end();
//     });
//   });
//
//   test('provides the hash within the document event.', (done) => {
//     socketPrinterSimulator.once('document', (document) => {
//       assert.that(document.hash).is.equalTo('3858f62230ac3c915f300c664312c63f');
//       done();
//     });
//
//     /* eslint-disable newline-after-var */
//     const client = net.connect(9100, () => {
//     /* eslint-enable newline-after-var */
//       client.write('foobar');
//       client.end();
//     });
//   });
//
//   test('handles multiple documents sequentially.', (done) => {
//     socketPrinterSimulator.once('document', (document1) => {
//       assert.that(document1.hash).is.equalTo('4bac13f288f4783e974f00bb5ba5e9d8');
//
//       socketPrinterSimulator.once('document', (document2) => {
//         assert.that(document2.hash).is.equalTo('93f14ebc97ed07368fd0ab33f45bc79e');
//         done();
//       });
//     });
//
//     /* eslint-disable newline-after-var */
//     let client = net.connect(9100, () => {
//     /* eslint-enable newline-after-var */
//       client.write('foobar 1');
//       client.end();
//
//       client = net.connect(9100, () => {
//         client.write('foobar 2');
//         client.end();
//       });
//     });
//   });
//
//   test('increments the count of all documents.', (done) => {
//     socketPrinterSimulator.once('document', (document1) => {
//       socketPrinterSimulator.once('document', (document2) => {
//         assert.that(document2.counter - document1.counter).is.equalTo(1);
//         done();
//       });
//     });
//
//     /* eslint-disable newline-after-var */
//     let client = net.connect(9100, () => {
//     /* eslint-enable newline-after-var */
//       client.write('foobar 1');
//       client.end();
//
//       client = net.connect(9100, () => {
//         client.write('foobar 2');
//         client.end();
//       });
//     });
//   });
//
//   test('rejects concurrent documents.', (done) => {
//     /* eslint-disable newline-after-var */
//     const client1 = net.connect(9100, () => {
//     /* eslint-enable newline-after-var */
//       client1.write('foobar 1');
//       client1.write('foobar 1');
//       client1.write('foobar 1');
//       client1.write('foobar 1');
//       client1.end();
//     });
//
//     /* eslint-disable newline-after-var */
//     const client2 = net.connect(9100, () => {
//     /* eslint-enable newline-after-var */
//       client2.write('foobar 2');
//       client2.write('foobar 2');
//       client2.write('foobar 2');
//       client2.write('foobar 2');
//       client2.end();
//     });
//
//     const handleError = (err) => {
//       assert.that(err.code).is.equalTo('EPIPE');
//
//       client1.removeListener('error', handleError);
//       client2.removeListener('error', handleError);
//       done();
//     };
//
//     client1.once('error', handleError);
//     client2.once('error', handleError);
//   });
// });
