'use strict';

var user = angular.module('tipExpert.user');

user.controller('userController', ['$scope', 'userService', 'alertService', function($scope, userService, alertService) {

    $scope.roles = [
        { name: 'Admin', index: 1 },
        { name: 'User', index: 2 }
    ];

    $scope.save = function() {
        userService.update($scope.users)
            .then(function() {
                alertService.info('Successfully saved.');
            })
            .catch(alertService.error);
    };

    userService.loadAllUser()
        .then(function(users) {
            $scope.users = users;
        })
        .catch(alertService.error);
}]);