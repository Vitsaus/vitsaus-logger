(function (name, definition){
  if (typeof define === 'function'){ // AMD
    define(definition);
  } else if (typeof module !== 'undefined' && module.exports) { // Node.js
    module.exports = definition();
  } else { // Browser
    var theModule = definition(), global = this, old = global[name];
    theModule.noConflict = function () {
      global[name] = old;
      return theModule;
    };
    global[name] = theModule;
  }
})('Logger', function () {

  function Logger(options) {

    this.messageCount = 0
    this.logs = {};
    this.filteredLevels = [];
    this.filteredCategories = [];
    this.loggers = [{
      name: 'default',
      fn: function(message, category, level) {
        console.log(category + ' :: ' + level + ' :: ' + JSON.stringify(message));
      }
    }];
    this.enabled = true;

    if (options) {
      if (options.filteredLevels) {
        this.filteredLevels = options.filteredLevels;
      }
      if (options.filteredCategories) {
        this.filteredCategories = options.filteredCategories;
      }
      if (options.enabled) {
        this.enabled = options.enabled;
      }
    }
  }

  Logger.prototype.log = function(message, category, level) {

    if (!category) {
      category = 'default';
    }

    if (!level) {
      level = 1;
    }

    if (!this.logs.hasOwnProperty(category)) {
        this.logs[category] = [];
    }

    if (!this.logs[category].hasOwnProperty(level)) {
      this.logs[category][level] = [];
    }

    this.logs[category][level].push(message);

    this.messageCount++;

    if (this.filteredLevels && this.filteredLevels.indexOf(level) > -1) {
      return;
    }

    if (this.filteredCategories && this.filteredCategories.indexOf(category) > -1) {
      return;
    }

    if (!this.enabled) return;

    var i = 0;

    for (; i < this.loggers.length; i++) {
      this.loggers[i].fn(message, category, level);
    }

  }

  Logger.prototype.setFilteredCategories = function(list) {
    this.filteredCategories = list;
  }

  Logger.prototype.setFilteredLevels = function(list) {
    this.filteredLevels = list;
  }

  Logger.prototype.addLogger = function(name, fn) {
    if (this.indexOf(name) > -1) return;
    this.loggers.push({
      name: name,
      fn: fn
    });
  }

  Logger.prototype.removeLogger = function(name) {
    this.loggers = this.loggers.splice(0, this.indexOf(name));
  }

  Logger.prototype.indexOf = function(name) {
    var i = 0;
    for (; i < this.loggers.length; i++) {
      if (this.loggers[i].name === name) {
        return i;
      }
    }
    return -1;
  }

  return Logger;

});
