/**
 * Formats mongoose errors into proper array
 *
 * @param {Array} errors
 * @return {Array}
 */
exports.formatErrors = function(errors) {
    var keys = Object.keys(errors);
    var errs = [];

    // if there is no validation error, just display a generic error
    if (!keys) {
        console.log(errors);
        return ['Oops! There was an error'];
    }

    keys.forEach(function(key) {
        errs.push(errors[key].message);
    });

    return errs;
};

/**
 * Check whether the given request is sent via a jquery ajax call (e.g. $.ajax())
 *
 * @param {request} request object
 * @return {bool}
 */
exports.isAjaxRequest = function(req) {
    
    return req.headers && 
           req.headers['x-requested-with'] && 
           req.headers['x-requested-with'] == 'XMLHttpRequest';
}