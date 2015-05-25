var assert = require('assert');
var Logger = require('../src/logger.js');

describe('logger', function() {

  it('should log with default settings', function() {

    var logger = new Logger();

    var counter = 0;

    logger.removeLogger('default');

    logger.addLogger('test', function(message, level, category) {
      counter++;
    });

    logger.log('hello world!');

    assert.equal(1, counter);

  });

});
