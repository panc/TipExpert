'use strict';

var game = angular.module('tipExpert.game');

game.controller('gameController', ['$scope', '$state', 'gameService', function($scope, $state, gameService) {
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

