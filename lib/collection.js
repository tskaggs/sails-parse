
/**
 * Module dependencies
 */

var _ = require('lodash'),
    async = require('async'),
    Errors = require('waterline-errors').adapter;

/**
 * Manage A Collection
 *
 * @param {Object} definition
 * @api public
 */

var Collection = module.exports = function Collection(definition, connection) {

  // Set an identity for this collection
  this.identity = '';

  // Hold Schema Information
  this.schema = null;

  // Hold a reference to an active connection
  this.connection = connection;

  // Hold Indexes
  this.indexes = [];

  // Parse the definition into collection attributes
  this._parseDefinition(definition);

  // Build an indexes dictionary
  this._buildIndexes();

  return this;
};