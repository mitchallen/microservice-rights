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
    
What this means is that only admin users can access URL's for admins.  But admins and user can access URL's designated for users.

The wildcard role ('*') means that all users with known roles can access it.

* * *

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
