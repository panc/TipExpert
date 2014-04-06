'use strict';

var game = angular.module('tipExpert.game');

game.controller('myGamesController', ['$scope', '$modal', '$state', 'gameService', function($scope, $modal, $state, gameService) {
    $scope.createdGames = [];
    $scope.invitedGames = [];

    $scope.createGame = function() {
        $modal.open({
            templateUrl: 'modules/game/views/addGameDialog.html',
            controller: 'AddGameController'
        });
    };
    
    gameService.loadGamesCreatedByCurrentUser(
        function(games) {
            $scope.createdGames = games;
        },
        toast.error);

    gameService.loadGamesForCurrentUser(
        function(games) {
            $scope.invitedGames = games;
        },
        toast.error);
}]);

