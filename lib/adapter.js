/**
 * Module Dependencies
 */
var _ = require('lodash'),
    async = require('async'),
    Kaiseki = require('kaiseki'),
    moment = require('moment');


/**
 * waterline-sails-parse
 *
 * Most of the methods below are optional.
 *
 * If you don't need / can't get to every method, just implement
 * what you have time for.  The other methods will only fail if
 * you try to call them!
 *
 * For many adapters, this file is all you need.  For very complex adapters, you may need more flexiblity.
 * In any case, it's probably a good idea to start with one file and refactor only if necessary.
 * If you do go that route, it's conventional in Node to create a `./lib` directory for your private submodules
 * and load them at the top of the file with other dependencies.  e.g. var update = `require('./lib/update')`;
 */
module.exports = (function () {


  // You'll want to maintain a reference to each connection
  // that gets registered with this adapter.
  var connections = {};



  // You may also want to store additional, private data
  // per-connection (esp. if your data store uses persistent
  // connections).
  //
  // Keep in mind that models can be configured to use different databases
  // within the same app, at the same time.
  //
  // i.e. if you're writing a MariaDB adapter, you should be aware that one
  // model might be configured as `host="localhost"` and another might be using
  // `host="foo.com"` at the same time.  Same thing goes for user, database,
  // password, or any other config.
  //
  // You don't have to support this feature right off the bat in your
  // adapter, but it ought to get done eventually.
  //

  var adapter = {

    // Set to true if this adapter supports (or requires) things like data types, validations, keys, etc.
    // If true, the schema for models using this adapter will be automatically synced when the server starts.
    // Not terribly relevant if your data store is not SQL/schemaful.
    //
    // If setting syncable, you should consider the migrate option,
    // which allows you to set how the sync will be performed.
    // It can be overridden globally in an app (config/adapters.js)
    // and on a per-model basis.
    //
    // IMPORTANT:
    // `migrate` is not a production data migration solution!
    // In production, always use `migrate: safe`
    //
    // drop   => Drop schema and data, then recreate it
    // alter  => Drop/add columns as necessary.
    // safe   => Don't change anything (good for production DBs)
    //
    syncable: false,


    // Default configuration for connections
    defaults: {
			appId: '',
      masterKey: '',
      restKey: ''
    },

    // Get Parse going
    getParse: function() {

      // console.log('running getParse');
      // console.log(this);

      if(this.parse == undefined)
        this.parse = new Kaiseki(this.defaults.appId, this.defaults.restKey);
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
     *
     * This method runs when a model is initially registered
     * at server-start-time.  This is the only required method.
     *
     * @param  {[type]}   connection [description]
     * @param  {[type]}   collection [description]
     * @param  {Function} cb         [description]
     * @return {[type]}              [description]
     */
    registerConnection: function(connection, collections, cb) {

      if(!connection.identity) return cb(new Error('Connection is missing an identity.'));
      if(connections[connection.identity]) return cb(new Error('Connection is already registered.'));

      // Add in logic here to initialize connection
      // e.g. connections[connection.identity] = new Database(connection, collections);
      connections[connection.identity] = connection;

      cb();
    },


    /**
     * Fired when a model is unregistered, typically when the server
     * is killed. Useful for tearing-down remaining open connections,
     * etc.
     *
     * @param  {Function} cb [description]
     * @return {[type]}      [description]
     */
    // Teardown a Connection
    teardown: function (conn, cb) {

      if (typeof conn == 'function') {
        cb = conn;
        conn = null;
      }
      if (!conn) {
        connections = {};
        return cb();
      }
      if(!connections[conn]) return cb();
      delete connections[conn];
      cb();
    },


    // Return attributes
    describe: function (connection, collection, cb) {
			// Add in logic here to describe a collection (e.g. DESCRIBE TABLE logic)
      return cb();
    },

    /**
     *
     * REQUIRED method if integrating with a schemaful
     * (SQL-ish) database.
     *
     */
    define: function (connection, collection, definition, cb) {
			// Add in logic here to create a collection (e.g. CREATE TABLE logic)
      return cb();
    },

    /**
     *
     * REQUIRED method if integrating with a schemaful
     * (SQL-ish) database.
     *
     */
    drop: function (connection, collection, relations, cb) {
			// Add in logic here to delete a collection (e.g. DROP TABLE logic)
			return cb();
    },

    /**
     *
     * REQUIRED method if users expect to call Model.find(), Model.findOne(),
     * or related.
     *
     * You should implement this method to respond with an array of instances.
     * Waterline core will take care of supporting all the other different
     * find methods/usages.
     *
     */
    find: function (connection, collection, options, cb) {
      console.log('--------- find function');


      if (options.order == null) {
        options.order = 'first_name';
      }

      console.log(options);

      if(options.where == null) {
        this.findAll(connection, collection, cb);
      } else {
        this.getParse().getObjects(collection, options, 
          function(err, res, body, success) {

            if(err) {
              console.log('err' + err);
              return cb(err)
            }

            if (success !== true) {
              console.log('body: ' + JSON.stringify(body));
              console.log('success: ' + JSON.stringify(success));
            } else {
              console.log('body: ' + JSON.stringify(body));
              console.log('success: ' + JSON.stringify(success));
            }
            console.log('---------');

            for (i = 0; i < body.length; i++) { 
                var newcreatedAt = moment(body[i].createdAt);
                var newupdatedAt = moment(body[i].updatedAt);
                body[i].createdAt = newcreatedAt._d;
                body[i].updatedAt = newupdatedAt._d;
                body[i].id = body[i].objectId;
            }

            cb(null, body);
          });
      }
    },

    findAll: function (connection, collection, cb) {
      console.log('--------- findAll function');

      this.getParse().getObjects(collection,
        function(err, res, body, success) {

          if(err) {
            console.log('err' + err);
            return cb(err)
          }

          if (success !== true) {
            console.log('body: ' + JSON.stringify(body));
            console.log('success: ' + JSON.stringify(success));
          } else {
            console.log('body: ' + JSON.stringify(body));
            console.log('success: ' + JSON.stringify(success));
          }
          console.log('---------');

          cb(null, body);
        });
    },

    findOne: function(connection, collection, options, cb) {
      console.log('--------- findOne function');

      console.log('options');
      console.log(options);

      this.getParse().getObject(collection, option, 
        function(err, res, body, success) {

          if(err) {
            console.log('err' + err);
            return cb(err)
          }

          if (success !== true) {
            console.log('body: ' + JSON.stringify(body));
            console.log('success: ' + JSON.stringify(success));
          } else {
            console.log('body: ' + JSON.stringify(body));
            console.log('success: ' + JSON.stringify(success));
          }
          console.log('---------');

          cb(null, body);
        });
    },

    create: function (connection, collection, values, cb) {
      console.log('--------- create function');

      // console.log(values.createdAt);

      // if(values.length > 1) {
      //   this.createEach(connection, collection, options, cb);
      // } else {
        if(values.objectId != undefined) delete values.objectId;
        if(values.createdAt != undefined) delete values.createdAt;
        if(values.updatedAt != undefined) delete values.updatedAt;

        this.getParse().createObject(collection, values, 
          function(err, res, body, success) {

            if(err) {
              console.log('err' + err);
              return cb(err)
            }
            
            if (success !== true) {
              console.log('body: ' + JSON.stringify(body));
              console.log('success: ' + JSON.stringify(success));
            } else {
              console.log('body: ' + JSON.stringify(body));
              console.log('success: ' + JSON.stringify(success));
            }
            console.log('---------');

            // This is so it passes the Timestamp test
            var newcreatedAt = moment(body.createdAt);
            var newupdatedAt = moment(body.updatedAt);
            body.createdAt = newcreatedAt._d;
            body.updatedAt = newupdatedAt._d;
            body.id = body.objectId;
            // Pass tests

            cb(null, body);
          }
        );
      // }
    },

    // createEach: function (connection, collection, values, cb) {
    //   console.log('--------- createEach function');

      // var parseit = this.getParse();

      // values.forEach(function (value) {

      //   if(value.objectId != undefined) delete value.objectId;
      //   if(value.createdAt != undefined) delete value.createdAt;
      //   if(value.updatedAt != undefined) delete value.updatedAt;

      //   parseit.createObject(collection, value, 
      //     function(err, res, body, success) {

      //       if(err) {
      //         console.log('err' + err);
      //         return cb(err)
      //       }
            
      //       if (success !== true) {
      //         console.log('body: ' + JSON.stringify(body));
      //         console.log('success: ' + JSON.stringify(success));
      //       } else {
      //         console.log('body: ' + JSON.stringify(body));
      //         console.log('success: ' + JSON.stringify(success));
      //       }
      //       console.log('---------');

      //       cb(null, body);
      //     }
      //   );
      // });
    // },

    update: function (connection, collection, options, values, cb) {
      console.log('--------- update function');

      this.getParse().updateObject(collection, options.where.objectId, values,
        function(err, res, body, success) {

          if(err) {
            console.log('err' + err);
            return cb(err)
          }

          if (success !== true) {
            console.log('body: ' + JSON.stringify(body));
            console.log('success: ' + JSON.stringify(success));
          } else {
            console.log('body: ' + JSON.stringify(body));
            console.log('success: ' + JSON.stringify(success));
          }
          console.log('---------');

          cb(null, body);
        }
      );
    },

    destroy: function (connection, collection, options, cb) {
      console.log('--------- destroy function');

      console.log(connection);
      console.log(collection);
      console.log(options);

      this.getParse().deleteObject(collection, options.where.first_name,
        function(err, res, body, success) {

          if(err) {
            console.log('err' + err);
            return cb(err)
          }
          
          if (success !== true) {
            console.log('body: ' + JSON.stringify(body));
            console.log('success: ' + JSON.stringify(success));
          } else {
            console.log('body: ' + JSON.stringify(body));
            console.log('success: ' + JSON.stringify(success));
          }
          console.log('---------');

          cb(null, body);
        }
      );
    },

    count: function(collection, cb) {
      // console.log('--------- count function');

      this.getParse().countObjects(collection, 
        function(err, res, body, success) {

          if(err) {
            console.log('err' + err);
            return cb(err)
          }

          if (success !== true) {
            console.log('body: ' + JSON.stringify(body));
            console.log('success: ' + JSON.stringify(success));
          } else {
            console.log('body: ' + JSON.stringify(body));
            console.log('success: ' + JSON.stringify(success));
          }
          console.log('---------');

          cb(null, body);
        })
    },


    /*

    // Custom methods defined here will be available on all models
    // which are hooked up to this adapter:
    //
    // e.g.:
    //
    foo: function (collectionName, options, cb) {
      return cb(null,"ok");
    },
    bar: function (collectionName, options, cb) {
      if (!options.jello) return cb("Failure!");
      else return cb();
      destroy: function (connection, collection, options, values, cb) {
       return cb();
     }

    // So if you have three models:
    // Tiger, Sparrow, and User
    // 2 of which (Tiger and Sparrow) implement this custom adapter,
    // then you'll be able to access:
    //
    // Tiger.foo(...)
    // Tiger.bar(...)
    // Sparrow.foo(...)
    // Sparrow.bar(...)


    // Example success usage:
    //
    // (notice how the first argument goes away:)
    Tiger.foo({}, function (err, result) {
      if (err) return console.error(err);
      else console.log(result);

      // outputs: ok
    });

    // Example error usage:
    //
    // (notice how the first argument goes away:)
    Sparrow.bar({test: 'yes'}, function (err, result){
      if (err) console.error(err);
      else console.log(result);

      // outputs: Failure!
    })




    */




  };


  // Expose adapter definition
  return adapter;

})();

