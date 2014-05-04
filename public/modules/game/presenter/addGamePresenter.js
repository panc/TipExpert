'use strict';

var game = angular.module('tipExpert.game');

game.controller('AddGameController', ['$scope', '$modalInstance', '$state', 'gameService', 'alertService', function($scope, $modalInstance, $state, gameService, alertService) {
    
    $scope.game = { };

    $scope.save = function() {
        $scope.submitted = true;

        if (this.addGameForm.$invalid)
            return;

        gameService.create($scope.game,
            function(newGame) {
                $modalInstance.close();
                $state.go('games.edit', { gameId: newGame._id });
            },
            alertService.error);
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
}]);
