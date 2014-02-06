'use strict';

angular.module('user', [])
    .factory('Auth', function($http, $cookieStore) {

        var accessLevels = {
            admin: 1,
            user: 2,
            public: 3
        };
        
        var userRoles = {
            admin: 1,
            user: 2,
            public: 3
        };
        
        var currentUser = $cookieStore.get('user') || { username: '', role: userRoles.public };

        $cookieStore.remove('user');

        function changeUser(user) {
            _.extend(currentUser, user);
        }

        ;

        return {
            authorize: function(accessLevel, role) {
                if (role === undefined)
                    role = currentUser.role;

                if (userRoles.admin)
                    return true;
                
                if (accessLevel == accessLevels.user && (role == userRoles.admin || role == userRoles.user))
                    return true;

                return accessLevel == accessLevels.public;
            },
            isLoggedIn: function(user) {
                if (user === undefined)
                    user = currentUser;
                
                return user.role == userRoles.user || user.role == userRoles.admin;
            },
//            register: function(user, success, error) {
//                $http.post('/register', user).success(function(res) {
//                    changeUser(res);
//                    success();
//                }).error(error);
//            },
            login: function(user, success, error) {
                $http.post('/login', user).success(function(user) {
                    changeUser(user);
                    success(user);
                }).error(error);
            },
            logout: function(success, error) {
                $http.post('/logout').success(function() {
                    changeUser({
                        username: '',
                        role: userRoles.public
                    });
                    success();
                }).error(error);
            },
            accessLevels: accessLevels,
            userRoles: userRoles,
            user: currentUser
        };
    });