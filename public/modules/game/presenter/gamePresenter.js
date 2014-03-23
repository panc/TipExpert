'use strict';

var game = angular.module('tipExpert.game');

game.controller('gameController', ['$scope', '$modal', 'gameService', 'matchService', function($scope, $modal, gameService, matchService) {
    $scope.games = [];
    
    gameService.load(
        function(games) {
            $scope.games = games;
        },
        function(data) {
            // todo
            alert(data);
        });
}]);

