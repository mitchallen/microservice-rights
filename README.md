@ mitchallen / microservice-rights
==================================

A module for defining rights to access a URL
---------------------------------------------------------
This module works in association with other modules based on the [@mitchallen/microservice-core](https://www.npmjs.com/package/@mitchallen/microservice-core) module. For a background on the core and microservices, visit the core npm page.

* * * 

## Disclaimer

__The author makes no claims that this system is secure. Use at your own risk.__

* * *

## Installation

You must use __npm__ __2.7.0__ or higher because of the scoped package name.

    $ npm init
    $ npm install @mitchallen/microservice-rights --save
  
* * *

## Usage

### Step 1: Setup npm dependencies

Open up a terminal window, create a folder for our app and change to it.  Then setup your npm package dependencies.

    $ npm init
    $ npm install @mitchallen/microservice-rights --save
    $ npm install @mitchallen/microservice-token --save
    $ npm install @mitchallen/microservice-core --save
    
### Step 2: Setup a secret key for your token

Create an environment variable holding your __secret__ key. This is used by the token middleware to encrypt the user role.

    $ export SECRET=mySecret

### Step 3: Create a file called index.js 

Create a file called __index.js__ and add the following:

	"use strict";

     let secret = process.env.SECRET;
     let tokenHandler = require('@mitchallen/microservice-token')(secret);
     let rightsWare = require('@mitchallen/microservice-rights');

### Step 4: Create a Rights Table

Define a table with roles and a list of what other roles can access something at that level.

Normally you would pull this from a shared resource. To keep things simple, we just hard-code it in this example.

    let table = {
        roles: [ "none", "admin", "user", "public" ],
        rights: {
            /// required rights : list of who can access links marked with required rights]
            // link marked admin can only be accessed by admin
            "admin"  : [ "admin" ], 
            // link marked user can be accessed by admin and user
            "user"   : [ "admin", "user" ], 
            // link marked public can be accessed by all
            "*"      : [ "admin", "user", "*" ]    
        }
    };
    
What this mean:

* Only admins can access a URL for admins. 
* Admins and users can access a URL for users
* Anyone can access a URL for wildcard ('*') 
* No one can access a URL designated as __none__.

### Step 5: Define your Web service

Using @mitchallen/microservice-core, setup a Web service using our rights manager and token middleware.

The names used above are completely arbitrary. You can use whatever names you like.

        var authorization = {
            access: "admin",
      		table: table
    	};

	    var options = {
      		service: {
                // Get the name and version from package.json
                name: require("./package").name,
                version: require("./package").version,
                verbose: true,
                port: process.env.SERVICE_PORT || 8004,
                apiVersion: process.env.API_VERSION || '/v1',
                method: function (info) {
                    var router = info.router;
                    router.use(tokenHandler);
                    router.get('/admin/home', 
                        // Test authorization
                        rightsWare.isAuthorized( authorization ),
                        function (req, res) {
                            var data = {
                                type: "restricted",
                                status: "You got in!",
                            };
                            res.json(data);
                        });
                    return router;
                }
            }
        };

        // Pass the options to microservice-core
		module.exports = require('@mitchallen/microservice-core')(options);

Save __index.js__

Type the following at the command line:

    $ node index.js

Leave that running.

### Step 6: Create the Key Master

Normally we might generate a token from a login service. But since we don't have a login service, we need to fake it.

Open up a new terminal window and switch to the same directory.

Since we didn't take steps to make our environment variable permanent, you will need to recreate it for this new window.

    $ export SECRET=mySecret

Create a file called __key-master.js__, add the following and save it:

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

### Step 7: Generate the tokens and curl commands

At the command line, type: 

    $ node key-master.js

It will produce output like this (*note that for your secret key the tokens will be different!*):

    -------------------------------------------------

    token: 
    
    eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoiSmFjayIsInJvbGUiOiJhZG1pbiJ9.rM2EJZ4s1StvcoeMh9K6P1LFWhlCwMKsGsAVH11z93M

    {"user":"Jack","role":"admin"}

    curl -i -X GET -H "x-auth: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoiSmFjayIsInJvbGUiOiJhZG1pbiJ9.rM2EJZ4s1StvcoeMh9K6P1LFWhlCwMKsGsAVH11z93M" -H "Content-Type: application/json" http://localhost:8004/v1/admin/home


    -------------------------------------------------

    token:

    eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoiSmFjayIsInJvbGUiOiJ1c2VyIn0.Y58tW4t4uYZPUX3iP2qFCHAcTOtgUPcQjD3Kds1f0Ik

    {"user":"Jack","role":"user"}

    curl -i -X GET -H "x-auth: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoiSmFjayIsInJvbGUiOiJ1c2VyIn0.Y58tW4t4uYZPUX3iP2qFCHAcTOtgUPcQjD3Kds1f0Ik" -H "Content-Type: application/json" http://localhost:8004/v1/admin/home


    -------------------------------------------------

    token:

    eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoiSmFjayIsInJvbGUiOiIqIn0.G0ivI5iG-_f6km_vV-xBHrT_lWN5v8agyapJfDnm9ts

    {"user":"Jack","role":"*"}

    curl -i -X GET -H "x-auth:     eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoiSmFjayIsInJvbGUiOiIqIn0.G0ivI5iG-_f6km_vV-xBHrT_lWN5v8agyapJfDnm9ts" -H "Content-Type: application/json" http://localhost:8004/v1/admin/home


    -------------------------------------------------

Based on whatever secret key you defined it will generate a token and curl command for each role.  

### Step 8: Test rights access

Copy and paste the curl commands for each role into the second terminal window.

For example (your token may be different based on your secret key):

    curl -i -X GET -H "x-auth: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoiSmFjayIsInJvbGUiOiJhZG1pbiJ9.rM2EJZ4s1StvcoeMh9K6P1LFWhlCwMKsGsAVH11z93M" -H "Content-Type: application/json" http://localhost:8004/v1/admin/home

For the admin role you should get a HTTP __200 OK__ response like this:

    HTTP/1.1 200 OK
    X-Powered-By: Express
    Content-Type: application/json; charset=utf-8
    Content-Length: 44
    Connection: keep-alive

For the other roles you should get a HTTP __401 Unauthorized__ response like this. 

    HTTP/1.1 401 Unauthorized
    X-Powered-By: Express
    X-Content-Type-Options: nosniff
    Content-Type: text/html; charset=utf-8
    Content-Length: 16
    Connection: keep-alive

The code above can be found in the __examples / access__ folder.

## Testing

To test, go to the root folder and type (sans __$__):

    $ npm test
   
* * *
 
## Repo(s)

* [bitbucket.org/mitchallen/microservice-rights.git](https://bitbucket.org/mitchallen/microservice-rights.git)
* [github.com/mitchallen/microservice-rights.git](https://github.com/mitchallen/microservice-rights.git)

* * *

## Contributing

In lieu of a formal style guide, take care to maintain the existing coding style.
Add unit tests for any new or changed functionality. Lint and test your code.

* * *

## Version History

#### Version 0.1.0 release notes

* initial release
