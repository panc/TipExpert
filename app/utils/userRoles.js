(function(exports) {
    
    exports.roles = {
        admin: 1,
        user: 2,
    };
    
})(typeof exports === 'undefined' ? this['userRoles'] = { } : exports);