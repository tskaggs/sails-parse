/*---------------------------------------------------------------
  :: sails-parse
  -> adapter
---------------------------------------------------------------*/

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

  // This method runs when a model is initially registered at server start time
  registerCollection: function(collection, cb) {
    cb();
  },

  // REQUIRED method if users expect to call Model.create() or any methods
  create: function(collectionName, values, cb) {
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
    if(options.where == null)
      options.where = {};
    if(options.limit == undefined)
      options.limit = 9999;
    this.getParse().getObjects(collectionName, options, 
      function(err, res, body, success) {
        if(err) console.log(err);
        cb(null, body);
      });
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

};
module.exports = adapter;

//////////////                 //////////////////////////////////////////
////////////// Private Methods //////////////////////////////////////////
//////////////                 //////////////////////////////////////////