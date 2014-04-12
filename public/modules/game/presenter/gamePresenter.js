'use strict';

var game = angular.module('tipExpert.game');

game.controller('gameController', ['$scope', '$modal', '$stateParams', 'gameService', function($scope, $modal, $stateParams, gameService) {
    
    $scope.game = { };
    $scope.submitted = true;
    $scope.minStake = 0.0;

    $scope.save = function() {

    };

    if ($stateParams.gameId) {
        gameService.load($stateParams.gameId,
            function(game) {
                $scope.game = game;
                $scope.minStake = game.minStake;
            },
            toast.error);
    }
}]);

