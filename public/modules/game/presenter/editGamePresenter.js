'use strict';

var game = angular.module('tipExpert.game');

game.controller('editGameController', ['$scope', '$state', '$stateParams', 'gameService', 'matchService', function($scope, $state, $stateParams, gameService, matchService) {
    
    $scope.game = {};

    if ($stateParams.gameId) {
        gameService.load($stateParams.gameId, function(game) {
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

        gameService.create($scope.game, function(newGame) {
            $state.go('games.edit', { gameId: newGame._id });
        },
        function(err) {
            alert(err);
        });
    };
}]);
