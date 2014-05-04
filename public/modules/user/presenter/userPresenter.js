'use strict';

var user = angular.module('tipExpert.user');

user.controller('userController', [
    '$scope', 'userService', 'alertService', function($scope, userService, alertService) {

        $scope.roles = [
            { name: 'Admin', index: 1 },
            { name: 'User', index: 2 }
        ];

        $scope.save = function() {
            userService.update($scope.users, function() {
                alertService.info('Successfully saved.');
            });
        };

        userService.loadAllUser(
            function(users) {
                $scope.users = users;
            },
            alertService.error);
    }
]);