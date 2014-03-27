'use strict';

var game = angular.module('tipExpert.game');

game.controller('SelectMatchesController', ['$scope', '$modalInstance', 'matchService', 'gameService', 'game', function($scope, $modalInstance, matchService, gameService, game) {
    
    $scope.game = game;

    //matchService.Select
    
    $scope.save = function() {

        gameService.update(game,
            function(updatedGame) {
                $modalInstance.close();
            },
            function(data) {
                // todo
                alert(data);
            });
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
}]);
