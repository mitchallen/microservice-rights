/**
    Author: Mitch Allen
      File: key-master.js
*/

"use strict";

let secret = process.env.SECRET || "test-server"; 
let port = process.env.SERVICE_PORT || 8004;

let jwt = require('jwt-simple');

let roles = ['admin','user','*'];

let bar = Array(50).join('-');

roles.forEach(function(value) {
    let testData = {
        user: 'Jack',
        role: value
    }

    var token = jwt.encode( testData, secret)
    
    console.log("%s\n\ntoken:\n\n%s\n\n%s", bar, token, JSON.stringify(testData));

    console.log(
        '\ncurl -i -X GET -H "x-auth: ' + token + '" ' +
        '-H "Content-Type: application/json" http://localhost:' + port + '/v1/admin/home\n\n');
}); 

console.log(bar);
