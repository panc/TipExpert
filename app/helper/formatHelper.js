/**
 * Formats mongoose errors into proper array
 *
 * @param {Array} errors
 * @return {Array}
 */
exports.formatErrors = function(errors) {
    errors = errors.errors || errors.err || errors;

    if (typeof errors === 'string')
        return errors;

    if (errors.message)
        return errors.message;

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