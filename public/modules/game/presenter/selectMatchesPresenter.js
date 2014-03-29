'use strict';

var game = angular.module('tipExpert.game');

game.controller('SelectMatchesController', ['$scope', '$modalInstance', 'leagueService', 'matchService', 'gameService', 'game', function($scope, $modalInstance, leagueService, matchService, gameService, game) {
    
    $scope.game = game;
    
    leagueService.load(
        function(leagues) {
            $scope.leagues = leagues;
            
            if (leagues.length > 0) {
                $scope.league = leagues[0];
                $scope.loadMatches($scope.league);
            }
        }, 
        toast.error);

    $scope.loadMatches = function(league) {
        matchService.load(league,
            function(matches) {
                $scope.matches = matches;
            },
            toast.error);
    };

    $scope.save = function() {

        gameService.update(game,
            function(updatedGame) {
                $modalInstance.close();
            },
            toast.error);
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
}]);
