/*---------------------------------------------------------------
  :: sails-parse
  -> adapter
---------------------------------------------------------------*/
var _ = require('underscore');
var async = require('async');
var Kaiseki = require('kaiseki');

var adapter = {

  syncable: false,

  defaults: {
    appId: '',
    masterKey: '',
    restKey: ''
  },
  getParse: function() {
    if(this.parse == undefined)
      this.parse = new Kaiseki(this.config.appId, this.config.restKey);
      return this.parse;
  },
  parse: undefined,
  async: function() {
    return async;
  },
  _: function() {
    return _;
  },

  // This method runs when a model is initially registered at server start time
  registerCollection: function(collection, cb) {
    cb();
  },

  // REQUIRED method if users expect to call Model.create() or any methods
  create: function(collectionName, values, cb) {
    if(values.objectId != undefined)
      delete values.objectId;
    this.getParse().createObject(collectionName, values, 
      function(err, res, body, success) {
         if(err) {
            console.log(err);
            cb(false);
          }
          else{
            cb(null, body);
          }
      });
  },

  find: function(collectionName, options, cb) {
    // If you are searching without criteria, find all
    if(options.where == null) {
      this.findAll(collectionName, options, cb);
    } else {
      this.getParse().getObjects(collectionName, options, 
        function(err, res, body, success) {
          cb(err, body);
        });
    }
  },

  findAll: function(collectionName, options, cb) {
    this.count(collectionName, function(err, body) {
        options.count = true;
        options.where = {};
        options.limit = 1000;
        var pages = Math.ceil(body.count/1000);
        this.async.times(pages, function(n, next) {
          options.skip = n*options.limit;
          adapter.getParse().getObjects(collectionName, options, 
            function(err, res, body, success) {
              next(err, body.results);
            });
        }, function(err, results) {
          var result = this._.flatten(results);
          result = _.filter(result, function(elem) {return typeof elem == 'object'});
          cb(err, result);
        })
      })
  },

  findOne: function(collectionName, id, cb) {
    this.getParse().getObject(collectionName, id, 
      function(err, res, body, success) {
        cb(null, body);
      });
  },

  update: function(collectionName, options, values, cb) {
    this.getParse().updateObject(collectionName, options.where.objectId, values,
      function(err, res, body, success) {
        if(err) {
          console.log(err);
        } else {
          cb(null, body);
        }
      });
  },

  destroy: function(collectionName, options, cb) {
    this.getParse().deleteObject(collectionName, options.where.objectId,
      function(err, res, body, success) {
        if(err) {
          console.log(err);
        } else {
          cb(null, body);
        }
      });
  },

  count: function(collectionName, cb) {
    this.getParse().countObjects(collectionName, 
      function(err, res, body, success) {
        if(err) 
          console.log(err);
        else
          cb(null, body);
      })
  }

};
module.exports = adapter;

//////////////                 //////////////////////////////////////////
////////////// Private Methods //////////////////////////////////////////
//////////////                 //////////////////////////////////////////