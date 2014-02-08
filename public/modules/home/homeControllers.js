'use strict';

/* Home module */

var homeModule = angular.module('tipExpert.home', []);

homeModule.controller('homeController', ['$window', '$scope', function($window, $scope) {
    
    $scope.loginOauth = function(provider) {
        $window.location.href = '/auth/' + provider;
    };
    
}]);