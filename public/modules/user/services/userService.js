'use strict';

var user = angular.module('tipExpert.user');

user.factory('userService', ['$http', '$q', function($http, $q) {

    var users = [];

    var load = function() {
        var deferred = $q.defer();

        if (users.length > 0) {
            deferred.resolve(users);
            return deferred.promise;
        }

        $http.get('/api/user')
            .success(function(data, status, headers, config) {

                angular.forEach(data, function(user) {
                    users.push(user);
                });

                deferred.resolve(users);
            })
            .error(deferred.reject);

        return deferred.promise;
    };

    return {
        loadAllUser: load,

        loadFriendsForUser: function(user) {
            // todo:
            // return all users for now
            // we can load the friends of a user later on
            return load();
        },

        loadProfile: function(userId) {
            var deferred = $q.defer();

            $http.get('/api/user/' + userId)
                .success(deferred.resolve)
                .error(deferred.reject);

            return deferred.promise;
        },

        update: function(usersToSave) {
            var deferred = $q.defer();
            var promises = [];
            
            angular.forEach(usersToSave, function(user) {
                promises.push($http.put('/api/user/' + user._id, user));
            });

            $q.all(promises)
                .then(deferred.resolve)
                .catch(function(result) {
                    deferred.reject(result.data);
                });

            return deferred.promise;
        }
    };
}]);