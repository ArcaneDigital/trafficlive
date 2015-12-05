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
    token : 'YOUR_API_TOKEN'
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


