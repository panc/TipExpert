'use strict';

/* Use the Match module */

var match = angular.module('tipExpert.match');

match.controller('EditMatchController', [
    '$scope', '$modalInstance', 'matchService', 'alertService', 'match', function($scope, $modalInstance, matchService, alertService, match) {

        $scope.match = match;

        $scope.save = function() {

            var success = function(newOrUpdatedMatch) { $modalInstance.close(newOrUpdatedMatch); };

            if (match._id)
                matchService.update(match, success, alertService.error);
            else
                matchService.create(match, success, alertService.error);
        };

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };
    }
]);