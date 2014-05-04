'use strict';

var user = angular.module('tipExpert.user');

user.controller('alertController', ['$scope', 'alertService', function($scope, alertService) {

        $scope.alerts = alertService.alerts;

        $scope.addAlert = function() {
            alertService.error('Another alert!');
        };

        $scope.closeAlert = function(index) {
            alertService.closeAlert(index);
        };
    }
]);