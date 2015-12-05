'use strict';
var   rest         = require('restler'),
      _            = require('underscore');

var trafficLive = function (options) {
  var self = this;
  if (!options.token) throw 'Token is required';
  if (!options.email) throw 'Email is required';

  var hash = new Buffer(options.email+':'+options.token);
  this.auth =  hash.toString('base64');

  this.pageSize = options.pageSize || 25;
  this.page = 1;
  this.results = [];
  this.baseUri = 'https://api.sohnar.com/TrafficLiteServer/openapi';

  this.api = {
    employees: {
      all: function (callback) {
        return self.request(rest.get, '/staff/employee', function (result) {
          callback(result);
        });
      },
      one: function (id, callback) {
        return self.request(rest.get, '/staff/employee/'+id, function (result) {
          callback(result);
        });
      }
    },
    clients: {
      all: function(callback){
        return self.request(rest.get, '/crm/client', function(result){
          callback(result);
        });
      }
    },
    jobs: {
      all: function(callback){
        return self.request(rest.get, '/job', function(result){
          callback(result);
        });
      },
      one: function(id, callback){
        return self.request(rest.get, '/job/'+id, function(result){
          callback(result);
        });
      }
    }
  };
  return this.api;
};

trafficLive.prototype.request = function(fn, uri, callback) {
  var self = this;
  var request = this.baseUri+uri+'?windowSize='+this.pageSize+'&currentPage='+this.page;
  var options = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + this.auth,
      'Accept': 'application/json',
      'Host': 'api.sohnar.com',
      'X-Target-URI': 'https://api.sohnar.com'
    }
  };

  fn(request, options)
  .on('complete', function(result) {
    console.log(self.results.length);
    if(result.resultList) {
      self.results = self.results.concat(result.resultList);
    } else {
      self.results = self.results.concat(result);
    }

    if(result.maxResults > self.page * self.pageSize) {
      self.page++;
      self.request(fn, uri, function (result) {
        callback(result);
      });
    } else {
      callback(self.results);
    }
  });
};
module.exports = trafficLive;