
/**
 * Home
 */
exports.index = function(req, res) {
    // show the landing page

    res.render('home/index', {
        title: req.i18n.__('TipExpert')
    });
};