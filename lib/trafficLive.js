/* jshint node: true, deve: true, browserify: true */
'use strict';
var   rest         = require('restler');

var trafficLive = function (options) {
  var self = this;
  if (!options.token) throw 'Token is required';
  if (!options.email) throw 'Email is required';

  var hash = new Buffer(options.email+':'+options.token);
  this.auth =  hash.toString('base64');

  this.pageSize = options.pageSize || 25;
  this.page = 1;
  this.results = [];
  this.filter = '';
  this.baseUri = 'https://api.sohnar.com/TrafficLiteServer/openapi';

  this.api = {
    employees: {
      related: function(options, callback) {
        callback({});
      },
      all: function (callback) {
        return self.request(rest.get, '/staff/employee', function (result) {
          callback(result);
        });
      },
      one: function (id, callback) {
        return self.request(rest.get, '/staff/employee/'+id, function (result) {
          callback(result);
        });
      },
      find: function (filter, callback) {
        self.filter = filter;
        return self.request(rest.get, '/staff/employee/?filter='+filter, function (result) {
          callback(result);
        });
      }
    },
    clients: {
      all: function(callback){
        return self.request(rest.get, '/crm/client', function(result){
          callback(result);
        });
      },
      one: function(id, callback){
        return self.request(rest.get, '/crm/client/'+id, function(result){
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
      },
      allDetails: function(callback){
        return self.request(rest.get, '/jobdetail/', function(result){
          callback(result);
        });
      },
      oneDetail: function(id, callback){
        return self.request(rest.get, '/jobdetail/'+id, function(result){
          callback(result);
        });
      }
    }
  };
  return this.api;
};

trafficLive.prototype.request = function(fn, uri, callback) {
  var self = this;
  var request = this.baseUri+uri;
  var options = {
    query: {
      'windowSize': this.pageSize,
      'currentPage': this.page,
      'filter': this.filter
    },
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + this.auth,
      'Accept': 'application/json',
      'Host': 'api.sohnar.com',
      'X-Target-URI': 'https://api.sohnar.com'
    }
  };
  var payload = {
    data: {},
    error: false,
    message: '',
    count: 0
  };
  fn(request, options)
  .on('400', function(){
      payload.message = 'bad request: This usually occurs because of a missing or malformed parameter. Check the documentation and the syntax of your request and try again.';
  })
  .on('401', function(){
      payload.message = 'no authorization: This can happen when you try to read or write to objects that the user does not have access to. The API key and request syntax were valid but the server is refusing to complete the request.';
  })
  .on('403', function(){
      payload.message = 'forbidden: This can happen when you try to read or write to objects that the user does not have access to. The API key and request syntax were valid but the server is refusing to complete the request.';
  })
  .on('404', function(){
      payload.message = 'not found: Either the object specified by the request does not exist, or the request method and path supplied do not specify a known action in the API.';
  })
  .on('500', function(){
      payload.message = 'internal server error: There was a problem on TrafficLIVE`s end.';
  })
  .on('502', function(){
      payload.message = 'bad gateway: There was a problem on TrafficLIVE`s end.';

  })
  .on('503', function(){
      payload.message = 'service unavailable: TrafficLIVE API imposes a limit on the rate at which users can make requests. The limit is currently 120 request per minute.';
  })
  .on('complete', function(result) {
    if (typeof result == 'string') {
      payload.error = true;
      callback(payload);
    } else {
      if(result.resultList) {
        self.results = self.results.concat(result.resultList);
      } else {
        self.results = self.results.concat(result);
      }
      if(!result.maxResults) {result.maxResults = 1;}
      if(result.maxResults > self.page * self.pageSize) {
        self.page++;
        self.request(fn, uri, function (result) {
          callback(result);
        });
      } else {

        payload.data = self.results;
        payload.count = self.results.length;
        console.log(self.results.length + ' of '+ result.maxResults);
        callback(payload);
      }

    }
  });
};
module.exports = trafficLive;