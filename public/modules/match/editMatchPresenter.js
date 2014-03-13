'use strict';

/* Use the Match module */

var match = angular.module('tipExpert.match');

match.controller('EditMatchController', ['$scope', '$modalInstance', 'matchService', 'match', function($scope, $modalInstance, matchService, match) {

    $scope.match = match;
    
    $scope.save = function() {

        var error = function(data) { alert(data); /* todo */ };
        var success = function(newOrUpdatedMatch) { $modalInstance.close(newOrUpdatedMatch); };

        if (match._id) 
            matchService.update(match, success, error);
        else
            matchService.create(match, success, error);
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
}]);