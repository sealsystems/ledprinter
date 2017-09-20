'use strict';

const assert = require('assertthat');

const PrinterSimulator = require('../lib/PrinterSimulator');

suite('PrinterSimulator', () => {
  test('is a function.', (done) => {
    assert.that(PrinterSimulator).is.ofType('function');
    done();
  });

  test('throws an error if options are missing.', (done) => {
    assert.that(() => {
      /* eslint-disable no-new */
      new PrinterSimulator();
      /* eslint-enable no-new */
    }).is.throwing('Options are missing.');
    done();
  });

  test('throws an error if the port is missing.', (done) => {
    assert.that(() => {
      /* eslint-disable no-new */
      new PrinterSimulator({ protocol: 'Socket', maxConnections: 1 });
      /* eslint-enable no-new */
    }).is.throwing('Port is missing.');
    done();
  });

  test('throws an error if the protocol is missing.', (done) => {
    assert.that(() => {
      /* eslint-disable no-new */
      new PrinterSimulator({ port: 9100, maxConnections: 1 });
      /* eslint-enable no-new */
    }).is.throwing('Protocol is missing.');
    done();
  });

  test('throws an error if the number of maximum connections is missing.', (done) => {
    assert.that(() => {
      /* eslint-disable no-new */
      new PrinterSimulator({ port: 9100, protocol: 'Socket' });
      /* eslint-enable no-new */
    }).is.throwing('Number of maximum connections is missing.');
    done();
  });

  test('throws an error if the protocol is invalid.', (done) => {
    assert.that(() => {
      /* eslint-disable no-new */
      new PrinterSimulator({ port: 9100, protocol: 'Foo', maxConnections: 1 });
      /* eslint-enable no-new */
    }).is.throwing('Invalid protocol.');
    done();
  });
});
