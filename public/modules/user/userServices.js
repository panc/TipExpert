'use strict';

/* Define the User module */

var userModule = angular.module('tipExpert.user', [ 'ngCookies' ]);
    
userModule.factory('Auth', ['$http', '$cookieStore', function($http, $cookieStore) {

        var accessLevels =  userConfig.accessLevels;
        var userRoles = userConfig.roles;
        
        var currentUser = $cookieStore.get('user') || { id: '', username: '', role: userRoles.public, picture: '' };

        $cookieStore.remove('user');

        function changeUser(user) {
            currentUser.username = user.username;
            currentUser.role = user.role;
        }
        
        return {
            authorize: function(accessLevel, role) {
                if (role === undefined)
                    role = currentUser.role;

                if (accessLevel == accessLevels.admin)
                    return role == userRoles.admin;
                
                if (accessLevel == accessLevels.user)
                    return role == userRoles.admin || role == userRoles.user;

                return true;
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
    }]);