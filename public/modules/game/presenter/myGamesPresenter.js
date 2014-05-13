'use strict';

var game = angular.module('tipExpert.game');

game.controller('myGamesController', ['$scope', '$modal', 'gameService', 'alertService', function($scope, $modal, gameService, alertService) {
    $scope.createdGames = [];
    $scope.invitedGames = [];

    $scope.createGame = function() {
        $modal.open({
            templateUrl: 'modules/game/views/addGameDialog.html',
            controller: 'AddGameController'
        });
    };
    
    gameService.loadGamesCreatedByCurrentUser()
        .then(function(games) {
            $scope.createdGames = games;
        })
        .catch(alertService.error);

    gameService.loadGamesForCurrentUser()
        .then(function(games) {
            $scope.invitedGames = games;
        })
        .catch(alertService.error);
}]);

