/**
    module: @mitchallen/microservice-rights
    author: Mitch Allen
*/

/* Usage:
 *
 * var rights = require( '@mitchallen/microservice-rights' )( rightsTable );
 *
 * router.get('/heartbeat', rights() function (req, res) { ... }
 *
 */

/*jslint es6 */

"use strict";

var jwt = require('jwt-simple');

var lib = {};

lib.isAuthorized = function (options) {

    var access = options.access;
    var table = options.table;

    return function (req, res, next) {

        var token = req.token;

        var emsg = "";

        if (!next) {
            throw new Error("next is not defined.");
        }

        if (!req) {
            emsg = "INTERNAL ERROR (microservice-rights): req not defined.";
            return next(emsg);
        }

        if (!access || !table) {
            emsg = "No Access";
            return next({ status: 401, message: emsg, type: 'authorization'});
        }

        if (access.toLowerCase() === "*") {
            // everyone has access
            return next();
        }

        if (!token) {
            emsg = "You must be logged in to access resource.";
            return next({ status: 401, message: emsg, type: 'authorization'});
        }

        if (!token.role) {
            emsg = "Role for user not defined.";
            return next({ status: 401, message: emsg, type: 'authorization'});
        }

        // Look up access and verify that role is associated with it.

        var list = table.rights[access.toLowerCase()];
        // TODO - check for null

        if (!list) {
            emsg = "Access not listed in table";
            return next({ status: 401, message: emsg, type: 'authorization'});
        }

        if (list.indexOf(token.role.toLowerCase()) >= 0) {
            return next();
        }

        emsg = "ACCESS DENIED.";
        return next({ status: 401, message: emsg, type: 'authorization'});

        next();
    };
};

module.exports = lib;