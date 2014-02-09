(function(exports) {
    
    exports.roles = {
        admin: 1,
        user: 2,
        public: 3
    };
    
    exports.accessLevels = {
        admin: 1,
        user: 2,
        public: 3
    };
    
})(typeof exports === 'undefined' ? this['userConfig'] = { } : exports);