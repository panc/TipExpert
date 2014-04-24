'use strict';

/* Use the Match module */

var match = angular.module('tipExpert.match');

match.controller('EditMatchController', ['$scope', '$modalInstance', 'matchService', 'match', function($scope, $modalInstance, matchService, match) {

    $scope.match = match;
    
    $scope.save = function() {

        var success = function(newOrUpdatedMatch) { $modalInstance.close(newOrUpdatedMatch); };

        if (match._id) 
            matchService.update(match, success, toast.error);
        else
            matchService.create(match, success, toast.error);
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
}]);