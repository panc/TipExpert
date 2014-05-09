'use strict';

var user = angular.module('tipExpert.user');

user.controller('userProfileController', ['$scope', 'Auth', function($scope, Auth) {

    $scope.user = Auth.user;
    $scope.hideRole = Auth.user.role == userConfig.roles.user;

    Auth.reloadCurrentUserProfile();
}]);