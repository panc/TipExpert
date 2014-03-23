'use strict';

var userModule = angular.module('tipExpert.user');
    
userModule.factory('Auth', ['$http', '$cookieStore', function($http, $cookieStore) {

        var accessLevels =  userConfig.accessLevels;
        var userRoles = userConfig.roles;
        
        function changeUser(user) {
            currentUser.id = user.id;
            currentUser.name = user.name;
            currentUser.role = user.role;
            
            currentUser.isLoggedIn = user.role == userRoles.user || user.role == userRoles.admin;
        }
        
        var currentUser = $cookieStore.get('user') || { id: '', name: '', role: userRoles.public, picture: '', isLoggedIn: false };

        $cookieStore.remove('user');
        changeUser(currentUser);
        
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
            signup: function(user, success, error) {
                $http.post('/signup', user).success(function(res) {
                    changeUser(res);
                    success();
                }).error(error);
            },
            login: function(user, success, error) {
                $http.post('/auth', user).success(function(user) {
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
            user: currentUser
        };
    }]);