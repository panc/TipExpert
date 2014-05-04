'use strict';

var game = angular.module('tipExpert.game');

game.controller('myGamesController', ['$scope', '$modal', '$state', 'gameService', 'alertService', function($scope, $modal, $state, gameService, alertService) {
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
        alertService.error);

    gameService.loadGamesForCurrentUser(
        function(games) {
            $scope.invitedGames = games;
        },
        alertService.error);
}]);

