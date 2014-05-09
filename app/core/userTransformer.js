var roles = require('../../public/modules/user/userConfig').roles;

exports.transformForCookie = function(user) {
    user = user || { };
    
    return {
        'id': user.id || user._id || '',
        'name': user.name || '',
        'role': user.role || roles.public,
        'email': user.email
    };
};

exports.transform = function(user) {
    user = user || { };
    
    var picture = '';
    if (user.google)
        picture = user.google.picture;
    if (user.facebook)
        picture = user.facebook.picture.data.url;

    return {
        id: user.id || user._id || '',
        name: user.name || '',
        role: user.role || roles.public,
        picture: picture,
        email: user.email,
        coins: user.coins
    };
};
