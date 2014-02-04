'use strict';

/* Home module */

var home = angular.module('home', []);

home.controller('homeController', ['$window', '$scope', function($window, $scope) {
    
    $scope.loginOauth = function(provider) {
        $window.location.href = '/auth/' + provider;
    };
    
}]);