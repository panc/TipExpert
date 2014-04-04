'use strict';

var user = angular.module('tipExpert.user');

user.factory('userService', ['$http', 'Auth', function($http, Auth) {

    var users = [];

    var load = function(success, error) {
        if (users.length > 0) {
            success(users);
            return;
        }

        $http.get('/api/user')
            .success(function(data, status, headers, config) {

                angular.forEach(data, function(user) {
                    users.push(user);
                });

                success(users);
            })
            .error(error);
    };

    return {
        loadAllUser: load,

        loadFriendsForUser: function(user, success, error) {
            // todo:
            // return all users for now
            // we can load the friends of a user later on
            load(success, error);
        },

        update: function(usersToSave, success, error) {

            angular.forEach(usersToSave, function(user) {

                $http.put('api/user/' + user._id, user)
                    .success(function(data, status, headers, config) {
                        success();
                    })
                    .error(error);
            });
        }
    };
}]);