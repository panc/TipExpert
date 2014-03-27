'use strict';

/* Home module */

var homeModule = angular.module('tipExpert.home', []);

homeModule.controller('homeController', ['$window', '$scope', '$translate', function($window, $scope, $translate) {

    $scope.changeLanguage = function(langKey) {
        $translate.use(langKey);
    };
}]);