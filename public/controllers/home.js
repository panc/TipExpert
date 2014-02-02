'use strict';

/* Home module */

var home = angular.module('home', []);

home.controller('homeController', function($scope) {
    $scope.phones = [
        { name: "Test1" },
        { name: "2. Test"}
    ];
    
    $scope.hello = "Hello";
});