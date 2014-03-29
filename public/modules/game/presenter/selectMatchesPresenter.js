'use strict';

var game = angular.module('tipExpert.game');

game.controller('SelectMatchesController', ['$scope', '$modalInstance', 'leagueService', 'matchService', 'gameService', 'game', function($scope, $modalInstance, leagueService, matchService, gameService, game) {
    
    $scope.game = game;

    leagueService.load(
        function(leagues) {
            $scope.leagues = leagues;
        }, 
        toast.error);
    

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
