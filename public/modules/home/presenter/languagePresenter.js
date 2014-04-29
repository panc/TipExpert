'use strict';

var user = angular.module('tipExpert.user');

user.controller('languageController', ['$scope', '$translate', function($scope, $translate) {

     $scope.changeLanguage = function(langKey) {
        $translate.use(langKey);
    };
    
}]);