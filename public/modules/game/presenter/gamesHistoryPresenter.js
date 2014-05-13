'use strict';

var game = angular.module('tipExpert.game');

game.controller('gamesHistoryController', ['$scope', '$modal', 'gameService', 'alertService', function($scope, $modal, gameService, alertService) {
    $scope.games = [];

    gameService.loadFinishedGamesForCurrentUser()
        .then(function(games) {
            $scope.invitedGames = games;
        })
        .catch(alertService.error);
}]);

