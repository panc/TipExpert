'use strict';

var game = angular.module('tipExpert.game');

game.controller('editGameController', ['$scope', '$state', '$stateParams', '$modal', 'gameService', 'matchService', function($scope, $state, $stateParams, $modal, gameService, matchService) {
    
    $scope.game = { };

    if ($stateParams.gameId) {
        gameService.load($stateParams.gameId,
            function(game) {
                $scope.game = game;
            },
            function(data) {
                // todo
                alert(data);
            });
    }

    $scope.save = function() {
        $scope.submitted = true;

        if ($scope.submitForm.$invalid)
            return;

        gameService.update($scope.game,
            function(newGame) {
                // nothing to do yet
            },
            function(err) {
                // todo
                alert(err);
            });
    };

    $scope.addMatch = function() {
        var modalInstance = $modal.open({
            templateUrl: 'modules/game/views/selectMatchesDialog.html',
            controller: 'SelectMatchesController',
            resolve: {
                game: function() {
                    return $scope.game;
                }
            }
        });

        modalInstance.result.then(function() {
            

        }, function() {
            // canceld -> nothing to do
        });
    };
}]);
