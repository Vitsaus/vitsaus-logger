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
    this.visibleLevels = [1];
    this.visibleCategories = ['default'];
    this.defaultLevel = 1;
    this.defaultCategory = 'default';
    this.enabled = true;

    this.loggers = [{
      name: 'default',
      fn: function(message, level, category) {
        console.log(level + ' :: ' + category + ' :: ' + JSON.stringify(message));
      }
    }];

    if (options) {
      if (options.filteredLevels) {
        this.filteredLevels = options.filteredLevels;
      }
      if (options.filteredCategories) {
        this.filteredCategories = options.filteredCategories;
      }
      if (options.visibleLevels) {
        this.visibleLevels = options.visibleLevels;
      }
      if (options.visibleCategories) {
        this.visibleCategories = options.visibleCategories;
      }
      if (options.enabled) {
        this.enabled = options.enabled;
      }
    }

  }

  Logger.prototype.log = function(message, level, category) {

    if (!category) {
      category = this.defaultCategory;
    }

    if (!level) {
      level = this.defaultLevel;
    }

    if (!this.logs.hasOwnProperty(category)) {
        this.logs[category] = [];
    }

    if (!this.logs[category].hasOwnProperty(level)) {
      this.logs[category][level] = [];
    }

    this.logs[category][level].push(message);

    this.messageCount++;

    if (this.visibleLevels.indexOf(level) === -1) {
      return;
    }

    if (this.visibleCategories.indexOf(category) === -1) {
      return;
    }

    if (this.filteredLevels.indexOf(level) > -1) {
      return;
    }

    if (this.filteredCategories.indexOf(category) > -1) {
      return;
    }

    if (!this.enabled) return;

    var i = 0;

    for (; i < this.loggers.length; i++) {
      this.loggers[i].fn(message, level, category);
    }

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
