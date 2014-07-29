/*---------------------------------------------------------------
  :: sails-parse
  -> adapter
---------------------------------------------------------------*/
var _ = require('lodash'),
    async = require('async'),
    Kaiseki = require('kaiseki'),
    Errors = require('waterline-errors').adapter;

module.exports = (function() {

  // Keep track of all the connections used by the app
  var connections = {};

  var _modelReferences = {};

  var _dbPools = {};

  var adapter = {

    // Which type of primary key is used by default
    pkFormat: 'string',

    // to track schema internally
    syncable: false,

    // Expose all the connection options with default settings
    defaults: {

      appId: '',
      masterKey: '',
      restKey: '',

      migrate: 'alter'
    },

    // Get Parse going
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

    /**
     * Register A Connection
     *
     * Will open up a new connection using the configuration provided and store the DB
     * object to run commands off of. This creates a new pool for each connection config.
     *
     * @param {Object} connection
     * @param {Object} collections
     * @param {Function} callback
     */
    // registerCollection: function(connection, collections, cb) {
    //   if(!connection.identity) return cb(Errors.IdentityMissing);
    //   if(connections[connection.identity]) return cb(Errors.IdentityDuplicate);

    //   // Store the connection
    //   connections[connection.identity] = {
    //     config: connection,
    //     collections: {}
    //   };

    //   // Create a new active connection
    //   new Connection(connection, function(err, db) {
    //     if(err) return cb(err);
    //     connections[connection.identity].connection = db;

    //     // Build up a registry of collections
    //     Object.keys(collections).forEach(function(key) {
    //       connections[connection.identity].collections[key] = new Collection(collections[key], db);
    //     });

    //     cb();
    //   });

    // },

    registerCollection: function(collection, cb) {

      // Keep a reference to this collection
      _modelReferences[collection.identity] = collection;
      
      cb();
    },


    /**
     * Teardown
     *
     * Closes the connection pool and removes the connection object from the registry.
     *
     * @param {String} connectionName
     * @param {Function} callback
     */

    // teardown: function(connectionName, cb) {
    //   if(!connections[connectionName]) return cb();

    //   // Drain the connection pool if available
    //   connections[connectionName].connection.db.close(function(err) {
    //     if(err) return cb(err);

    //     // Remove the connection from the registry
    //     delete connections[connectionName];
    //     cb();

    //   });
    // },

    teardown: function(cb) {
      cb();
    },

     /**
     * Define
     *
     * Create a new Mongo Collection and set Index Values
     *
     * @param {String} connectionName
     * @param {String} collectionName
     * @param {Object} definition
     * @param {Function} callback
     */

    // define: function(connectionName, collectionName, definition, cb) {

    //   var connectionObject = connections[connectionName];
    //   var collection = connectionObject.collections[collectionName];

    //   // Create the collection and indexes
    //   connectionObject.connection.createCollection(collectionName, collection, cb);
    // },

    define: function(collectionName, definition, cb) {

      // If you need to access your private data for this collection:
      var collection = _modelReferences[collectionName];

      // Define a new "table" or "collection" schema in the data store
      cb();
    },

    /**
     * Describe
     *
     * Return the Schema of a collection after first creating the collection
     * and indexes if they don't exist.
     *
     * @param {String} connectionName
     * @param {String} collectionName
     * @param {Function} callback
     */

    // describe: function(connectionName, collectionName, cb) {

    //   var connectionObject = connections[connectionName];
    //   var collection = connectionObject.collections[collectionName];
    //   var schema = collection.schema;

    //   connectionObject.connection.db.collectionNames(collectionName, function(err, names) {
    //     if(names.length > 0) return cb(null, schema);
    //     cb();
    //   });
    // },

    describe: function(collectionName, cb) {

      // If you need to access your private data for this collection:
      var collection = _modelReferences[collectionName];

      // Respond with the schema (attributes) for a collection or table in the data store
      var attributes = {};
      cb(null, attributes);
    },

     /**
     *
     *
     * REQUIRED method if integrating with a schemaful
     * (SQL-ish) database.
     * 
     * @param  {[type]}   collectionName [description]
     * @param  {[type]}   relations      [description]
     * @param  {Function} cb             [description]
     * @return {[type]}                  [description]
     */
    drop: function(collectionName, relations, cb) {
      // If you need to access your private data for this collection:
      var collection = _modelReferences[collectionName];

      // Drop a "table" or "collection" schema from the data store
      cb();
    },

    /**
     * Required Method
     * Create
     *
     * Insert a single document into a collection.
     *
     * @param {String} connectionName
     * @param {String} collectionName
     * @param {Object} data
     * @param {Function} callback
     */

    // create: function(connectionName, collectionName, data, cb) {
      
    //   var connectionObject = connections[connectionName];
    //   var collection = connectionObject.collections[collectionName];

    //   if(data.objectId != undefined) delete data.objectId;

    //   this.getParse().createObject(collection, data, 
    //     function(err, res, body, success) {
    //       if(err) return cb(err);
    //       cb(null, body);
    //     });
    // },

    create: function(collectionName, data, cb) {
      
      var collection = _modelReferences[collectionName];

      if(data.objectId != undefined) delete data.objectId;

      this.getParse().createObject(collection, data, 
        function(err, res, body, success) {
          if(err) return cb(err);
          cb(null, body);
        });
    },

    /**
     * Find
     *
     * Find all matching documents in a colletion.
     *
     * @param {String} connectionName
     * @param {String} collectionName
     * @param {Object} options
     * @param {Function} callback
     */

    // find: function(connectionName, collectionName, options, cb) {
    //   options = options || {};
    //   var connectionObject = connections[connectionName];
    //   var collection = connectionObject.collections[collectionName];

    //   // If you are searching without criteria, find all
    //   if(options.where == null) {
    //     this.findAll(collection, options, cb);
    //   } else {
    //     this.getParse().getObjects(collection, options, 
    //       function(err, res, body, success) {
    //         if(err) return cb(err);

    //         cb(null, body);
    //       });
    //   }
    // },

    find: function(collectionName, options, cb) {
      options = options || {};
      var collection = _modelReferences[collectionName];

      // If you are searching without criteria, find all
      if(options.where == null) {
        this.findAll(collection, options, cb);
      } else {
        this.getParse().getObjects(collection, options, 
          function(err, res, body, success) {
            if(err) return cb(err);

            cb(null, body);
          });
      }
    },

     /**
     * Find All
     *
     * Find all matching documents in a colletion.
     *
     * @param {String} connectionName
     * @param {String} collectionName
     * @param {Object} options
     * @param {Function} callback
     */

    // findAll: function(connectionName, collectionName, options, cb) {
    //   options = options || {};
    //   var connectionObject = connections[connectionName];
    //   var collection = connectionObject.collections[collectionName];


    //   this.count(collection, function(err, body) {
    //       options.count = true;
    //       options.where = {};
    //       options.limit = 1000;
    //       var pages = Math.ceil(body.count/1000);
    //       this.async.times(pages, function(n, next) {
    //         options.skip = n*options.limit;
    //         adapter.getParse().getObjects(collection, options, 
    //           function(err, res, body, success) {
    //             next(err, body.results);
    //           });
    //       }, function(err, results) {
    //         var result = this._.flatten(results);
    //         result = _.filter(result, function(elem) {return typeof elem == 'object'});
    //         cb(err, result);
    //       })
    //     })
    // },

    findAll: function(collectionName, options, cb) {
      options = options || {};
      var collection = _modelReferences[collectionName];

      this.count(collection, function(err, body) {
          options.count = true;
          options.where = {};
          options.limit = 1000;
          var pages = Math.ceil(body.count/1000);
          this.async.times(pages, function(n, next) {
            options.skip = n*options.limit;
            adapter.getParse().getObjects(collection, options, 
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

    /**
     * FindOne
     *
     * Find all matching one object in a colletion.
     *
     * @param {String} connectionName
     * @param {String} collectionName
     * @param {Object} options
     * @param {Function} callback
     */

    // findOne: function(connectionName, collectionName, option, cb) {
    //   options = options || {};
    //   var connectionObject = connections[connectionName];
    //   var collection = connectionObject.collections[collectionName];

    //   this.getParse().getObject(collection, option, 
    //     function(err, res, body, success) {
    //       if(err) return cb(err);
    //       cb(null, body);
    //     });
    // },

    findOne: function(collectionName, option, cb) {
      options = options || {};
      var collection = _modelReferences[collectionName];

      this.getParse().getObject(collection, option, 
        function(err, res, body, success) {
          if(err) return cb(err);
          cb(null, body);
        });
    },

    /**
     * Update
     *
     * Update all documents matching a criteria object in a collection.
     *
     * @param {String} connectionName
     * @param {String} collectionName
     * @param {Object} options
     * @param {Object} values
     * @param {Function} callback
     */

    // update: function(connectionName, collectionName, options, values, cb) {

    //   var connectionObject = connections[connectionName];
    //   var collection = connectionObject.collections[collectionName];

    //   this.getParse().updateObject(collection, options.where.objectId, values,
    //     function(err, res, body, success) {
    //       if(err) return cb(err);
    //       cb(null, body);
    //     });
    // },

    update: function(collectionName, options, values, cb) {

      var collection = _modelReferences[collectionName];

      this.getParse().updateObject(collection, options.where.objectId, values,
        function(err, res, body, success) {
          if(err) return cb(err);
          cb(null, body);
        });
    },

    /**
     * Destroy
     *
     * Destroy all documents matching a criteria object in a collection.
     *
     * @param {String} connectionName
     * @param {String} collectionName
     * @param {Object} options
     * @param {Function} callback
     */

    // destroy: function(connectionName, collectionName, options, cb) {
    //   options = options || {};
    //   this.getParse().deleteObject(collection, options.where.objectId,
    //     function(err, res, body, success) {
    //       if(err) return cb(err);
    //       cb(null, body);
    //     });
    // },

    destroy: function(collectionName, options, cb) {
      options = options || {};
      var collection = _modelReferences[collectionName];

      this.getParse().deleteObject(collection, options.where.objectId,
        function(err, res, body, success) {
          if(err) return cb(err);
          cb(null, body);
        });
    },

    /**
     * Count
     *
     * Count all documents matching a criteria object in a collection.
     *
     * @param {String} connectionName
     * @param {String} collectionName
     * @param {Object} options
     * @param {Function} callback
     */

    // count: function(connectionName, collectionName, cb) {
      
    //   var connectionObject = connections[connectionName];
    //   var collection = connectionObject.collections[collectionName];

    //   this.getParse().countObjects(collection, 
    //     function(err, res, body, success) {
    //       if(err) return cb(err);
    //       cb(null, body);
    //     })
    // },

    count: function(collectionName, cb) {
      
      var collection = _modelReferences[collectionName];

      this.getParse().countObjects(collection, 
        function(err, res, body, success) {
          if(err) return cb(err);
          cb(null, body);
        })
    },

    /**
     * Login
     *
     * Login
     *
     * @param {String} connectionName
     * @param {String} collectionName
     * @param {Object} options
     * @param {Function} callback
     */


    // login: function(connectionName, collectionName, options, cb) {
    //   var connectionObject = connections[connectionName];
    //   var collection = connectionObject.collections[collectionName];

    //   if(collection == '_User' 
    //     && options.username != undefined 
    //     && options.password != undefined) {
    //       adapter.getParse().loginUser(options.username, options.password,
    //         function(err, res, body, success) {
    //           if(err) return cb(err);
    //           cb(null, body);
    //       })
    //   } else {
    //     throw 'Colé, mané?';
    //   }
    // },

    login: function(collectionName, options, cb) {

      var collection = _modelReferences[collectionName];

      if(collection == '_User' 
        && options.username != undefined 
        && options.password != undefined) {
          adapter.getParse().loginUser(options.username, options.password,
            function(err, res, body, success) {
              if(err) return cb(err);
              cb(null, body);
          })
      } else {
        throw 'Colé, mané?';
      }
    },

    identity: 'sails-parse'
  };

  return adapter;
})();
