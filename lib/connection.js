
/**
 * Module dependencies
 */

var _ = require('lodash');

// Get Parse going
// Testing stuff
// var getParse = module.exports = function getParse() {
//   if(this.parse == undefined)
//     this.parse = new Kaiseki(this.config.appId, this.config.restKey);
//   return this.parse;
// };
// var parse = undefined;

/**
 * Manage a connection to a Parse Server
 *
 * @param {Object} config
 * @return {Object}
 * @api private
 */

var Connection = module.exports = function Connection(config, cb) {
  var self = this;

  console.log('Running Connection via connectionjs');
  console.log(self);

  // Hold the config object
  this.config = config || {};

  // Build Database connection
  this._buildConnection(function(err, db) {
    if(err) return cb(err);

    // Store the DB object
    self.db = db;

    // Return the connection
    cb(null, self);
  });
};