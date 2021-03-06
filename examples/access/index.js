"use strict";

 let secret = process.env.SECRET || "test-server"; // Don't hard code in production!
 let tokenHandler = require('@mitchallen/microservice-token')(secret);
 let rightsWare = require('@mitchallen/microservice-rights');

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