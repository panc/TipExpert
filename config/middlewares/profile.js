
/*
 *  Expose passport user-info to all views
 */

exports.exposeUserInfoToViews = function(req, res, next) {
    if (req.isAuthenticated()) {
        res.locals.user = req.user;
    }

    next();
};