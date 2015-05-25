var assert = require('assert');
var Logger = require('../src/logger.js');

describe('logger', function() {

  it('should log with default settings', function() {

    var logger = new Logger();
    logger.removeLogger('default');

    logger.log(1, 'test', 'hello world!');

    assert.equal(1, logger.messageCount);

  });

  it('should work with custom loggers', function() {

    var logger = new Logger();

    logger.removeLogger('default');

    logger.addLogger('custom', function(level, category, message) {
      assert.equal(1, level);
      assert.equal('category', category);
      assert.equal('message', message);
    });

    logger.log(1, 'category', 'message');

  });

  it('should filter categories', function() {

    var logger = new Logger({
      filteredCategories: ['alfa']
    });

    var counter = 0;

    logger.removeLogger('default');

    logger.addLogger('testing', function(level, category, message) {
      counter++;
    });

    logger.log(1, 'alfa', 'Hello world');
    logger.log(1, 'beta', 'Second message');

    assert.equal(1, counter);

  });

  it('should filter levels', function() {

    var logger = new Logger({
      filteredLevels: [1]
    });

    var counter = 0;

    logger.removeLogger('default');

    logger.addLogger('testing', function(level, category, message) {
      counter++;
    });

    logger.log(1, 'alfa', 'Hello world');
    logger.log(2, 'beta', 'Second message');

    assert.equal(1, counter);

  });

});
