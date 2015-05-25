var assert = require('assert');
var Logger = require('../src/logger.js');

describe('logger', function() {

  it('should log with default settings', function() {

    var logger = new Logger();
    logger.removeLogger('default');

    logger.log('hello world!');

    assert.equal(1, logger.messageCount);

  });

  it('should work with custom loggers', function() {

    var logger = new Logger();

    logger.removeLogger('default');

    var counter = 0;

    logger.addLogger('test', function(message, level, category) {
      assert.equal('hello world', message);
      assert.equal('default', category);
      assert.equal(1, level);
      counter++;
    });

    logger.log('hello world');

    assert.equal(1, counter);

  });

  it('should filter categories', function() {

    var logger = new Logger({
      filteredCategories: ['alfa']
    });

    var counter = 0;

    logger.removeLogger('default');

    logger.addLogger('test', function() {
      counter++;
    });

    logger.log('a', 1, 'alfa');
    logger.log('a', 1, 'beta');

    assert.equal(1, counter);

  });

  it('should filter levels', function() {

    var logger = new Logger({
      filteredLevels: [1]
    });

    var counter = 0;

    logger.removeLogger('default');

    logger.addLogger('test', function() {
      counter++;
    });

    logger.log('a', 1);
    logger.log('a', 1);
    logger.log('a', 2);

    assert.equal(1, counter);

  });

});
