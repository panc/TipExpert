'use strict';

var game = angular.module('tipExpert.game');

game.controller('gameController', ['$scope', '$modal', '$stateParams', 'gameService', function($scope, $modal, $stateParams, gameService) {
    
    $scope.game = { };

    $scope.save = function() {

    };

    if ($stateParams.gameId) {
        gameService.load($stateParams.gameId,
            function(game) {
                $scope.game = game;
            },
            toast.error);
    }
}]);

