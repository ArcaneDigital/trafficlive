# trafficlive
A wrapper for the TrafficLive API.

## Install via NPM!
```
npm install trafficlive
```

## Example usage
```js
var TrafficLive = require('trafficlive');

var tl = new TrafficLive({
    email: 'YOUR_EMAIL_ADDRESS',
    token : 'YOUR_API_TOKEN',
    pageSize: 250 //max 500
});
//All Employees
tl.employees.all(function(response){
    for(var i in response) {
        console.log(response[i].id);
    }
});

//Single Employee
tl.employees.one(12345,function(response){
    console.log(response);
});

```

## Supported methods

### employees

* `employees.all(callback)`
* `employees.one(employeeId, callback)`
* `employees.find(filter, callback)`

### clients

* `clients.all(callback)`
* `clients.one(clientId, callback)`
* `clients.find(filter, callback)`

### jobs

* `jobs.all(callback)`
* `jobs.one(jobId, callback)`
* `jobs.allDetails(callback)`
* `jobs.oneDetail(jobId, callback)`


### Filtering
Criteria filtering enables you to apply filters to your API requests in order to limit your results to more relevant data. The format for applying a criteria filter is:

Property|Comparator|Value

Property refers to the property of the object in the list such as the jobNumber or dateModified for example. Value refers to the value you want to compare to. And comparator refers to one of the following types (some of them have two forms):

|comparator|examples|description|
|:---|:---:|:---|
|EQUAL / EQ|jobNumber\|EQ\|"J55"|Equality comparator|
|NOT_EQUAL / NE|jobNumber\|NOT_EQUAL\|"J55"|Not equality comparator|
|LIKE|jobStateType\|LIKE\|"progress"|Like case insensitive comparator|
|LIKE_CASE_SENSITIVE|jobStateType\|LIKE_CASE_SENSITIVE\|"PROGRESS"|Like case sensitive comparator|
|NOT_LIKE|jobStateType\|NOT_LIKE\|"progress"|Not like case insensitive comparator|
|NOT_LIKE_CASE_SENSITIVE|jobStateType\|NOT_LIKE_CASE_SENSITIVE\|"PROGRESS"|Not like case sensitive comparator|
|LESS_THAN / LT|id\|LESS_THAN\|50|Less than comparator|
|GREATER_THAN / GT|id\|GT\|50|Greater than comparator|
|LESS_OR_EQUAL / LE|id\|LE\|50|Less or equal comparator|
|GREATER_OR_EQUAL / GE|id\|GREATER_OR_EQUAL\|50|Greater or equal comparator|
|IN|id\|IN\|[1,2,3,4,10]|In comparator|
|IN_ALL|id\|IN_ALL\|[1,2,3,4,10]|In all comparator|

##### Example Filters

```javascript
//Find employee by username
tl.employees.find('userName|EQ|"john.doe@example.com"', function(response){
   console.log(response);
});

//Find client using partial name
tl.clients.find('name|LIKE|"Acme%"', function(response){
   console.log(response);
});

//Find employees who started after January 2015
tl.employees.find('filter=dateCreated|GT|"2015-01-01T00:00:00.000+0000"', function(response){
   console.log(response);
});

//
```


