@ mitchallen / microservice-rights
==================================

A microservice module for defining rights to access a URL
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

Open up a terminal window, create a folder for our app and change to it.  Then setup your npm package dependencies.

    $ npm init
    $ npm install @mitchallen/microservice-rights --save
    $ npm install @mitchallen/microservice-token --save
    $ npm install @mitchallen/microservice-core --save
    
Setup a secret key for your token:

    $ export SECRET=mySecret

Create a file called __index.js__ and add the following:

	"use strict";

     let secret = process.env.SECRET;
     let tokenHandler = require('@mitchallen/microservice-token')(secret);
     let rightsWare = require('@mitchallen/microservice-rights');

Define a table with roles and a list of what other roles can access something at that level

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
                    router.get( '/admin/home', 
                        // Test authorization
                        rightsWare.isAuthorized( authorization ),
                        function (req, res) {
                            var data = {
                                type: dataType,
                                status: dataStatus,
                            };
                            res.json(data);
                        });
                    return router;
                }
            }
        };

The names used above are completely arbitrary. You can use whatever names you like.

## Testing

To test, go to the root folder and type (sans __$__):

    $ npm test
   
* * *
 
## Repo(s)

* [bitbucket.org/mitchallen/microservice-rights.git](https://bitbucket.org/mitchallen/microservice-rights.git)

* * *

## Contributing

In lieu of a formal style guide, take care to maintain the existing coding style.
Add unit tests for any new or changed functionality. Lint and test your code.

* * *

## Version History

#### Version 0.1.0 release notes

* initial release
