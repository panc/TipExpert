'use strict';

var game = angular.module('tipExpert.game');

game.controller('myGamesController', ['$scope', '$modal', '$state', 'gameService', function($scope, $modal, $state, gameService) {
    $scope.games = [];

    $scope.createGame = function() {
        $modal.open({
            templateUrl: 'modules/game/views/addGameDialog.html',
            controller: 'AddGameController'
        });
    };
    
    gameService.loadGamesForCurrentUser(
        function(games) {
            $scope.games = games;
        },
        toast.error);
}]);
