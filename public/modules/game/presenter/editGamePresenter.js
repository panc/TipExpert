'use strict';

var game = angular.module('tipExpert.game');

game.controller('editGameController', ['$scope', '$state', 'gameService', 'matchService', function($scope, $state, gameService, matchService) {
    
    $scope.game = { title: 'test' };

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

