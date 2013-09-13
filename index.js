/*---------------------------------------------------------------
  :: sails-boilerplate
  -> adapter
---------------------------------------------------------------*/

var async = require('async');
var Parse = require('node-parse-api').Parse;

var adapter = {

  syncable: false,

  defaults: {
    appId: '',
    masterKey: ''
  },
  getParse: function() {
    if(this.parse == undefined)
      this.parse = new Parse(this.config.appId, this.config.masterKey);

      return this.parse;
  },
  parse: undefined,

  // This method runs when a model is initially registered at server start time
  registerCollection: function(collection, cb) {

    cb();
  },


  // REQUIRED method if users expect to call Model.create() or any methods
  create: function(collectionName, values, cb) {
    this.getParse().insert(collectionName, values, function(err, response) {
      if(err) {
        console.log(err);
        cb(false);
      }
      else{
        cb(null, response);
      }
    })
  },

  find: function(collectionName, options, cb) {
    if(options.where == undefined)
      options.where = {};
    this.getParse().findMany(collectionName, options.where, function(err, response) {
      if(err) console.log(err);
      cb(null, response.results);
    }); 
  },

  findOne: function(collectionName, id, cb) {
    this.getParse().find(collectionName, id, function(err, response) {
      cb();
    })
  },

  // REQUIRED method if users expect to call Model.update()
  update: function(collectionName, options, values, cb) {
    this.getParse().update(collectionName, options.where.objectId, values, 
      function(err, response) {
          if(err) {
            console.log(err);
          } else {
            cb(null, response);
          }
      })
  },

  // REQUIRED method if users expect to call Model.destroy()
  destroy: function(collectionName, options, cb) {
    this.getParse().delete(collectionName, options.where.objectId, function(err) {
      if(err) console.log(err);
      cb();
    })
  },

};
module.exports = adapter;

//////////////                 //////////////////////////////////////////
////////////// Private Methods //////////////////////////////////////////
//////////////                 //////////////////////////////////////////