'use strict';

var user = angular.module('tipExpert.user');

user.controller('userController', ['$http', '$scope', function($http, $scope)  {

    $scope.roles = [
        { name: 'Admin', index: 1 },
        { name: 'User', index: 2 }
    ];

    $scope.save = function() {
        angular.forEach($scope.users, function(user) {
            $http.put('api/user/' + user._id, user)
                .success(function(data, status, headers, config) {
                    alert('success');
                })
                .error(function(data, status, headers, config) {
                    // todo 
                    alert(data);
                });
        });
    };
    
    $http.get('/api/user').
        success(function(data, status, headers, config) {
            $scope.users = data;
        })
        .error(function(data, status, headers, config) {
            // todo
            alert(data);
        });
}]);