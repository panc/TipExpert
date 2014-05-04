'use strict';

var game = angular.module('tipExpert.game');

game.controller('SelectMatchesController', ['$scope', '$modalInstance', 'leagueService', 'matchService', 'gameService', 'alertService', 'game', function($scope, $modalInstance, leagueService, matchService, gameService, alertService, game) {
    
    var selectedMatches = game.matches.slice(0);

    var areMatchesEqual = function(match, otherMatch) {
        return match.homeTeam == otherMatch.homeTeam
            && match.guestTeam == otherMatch.guestTeam
            && match.dueDate == otherMatch.dueDate
            && match.league == otherMatch.league;
    };
    
    $scope.loadMatches = function(league) {
        matchService.load(league,
            function(matches) {
                $scope.matches = matches;

                angular.forEach(matches, function(match) {
                    angular.forEach(selectedMatches, function(matchContainer) {
                        
                        if (areMatchesEqual(match, matchContainer.match))
                            match.selected = true;
                    });
                });

            },
            alertService.error);
    };

    $scope.toggleMatchSelection = function(match) {
        match.selected = !match.selected;

        if (match.selected) {
            // if selected add the match to the match-list of the game
            var container = { match: match };
            selectedMatches.push(container);
        }
        else {
            // if not selected remove the match from the match-list of the game
            angular.forEach(selectedMatches, function(matchContainer) {
                
                if (areMatchesEqual(match, matchContainer.match)) {
                    var index = selectedMatches.indexOf(matchContainer);
                    selectedMatches.splice(index, 1);
                }
            });
        }
    };

    $scope.save = function() {

        game.matches = selectedMatches;

        gameService.update(game,
            function(updatedGame) {
                $modalInstance.close(updatedGame);
            },
            alertService.error);
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
    
    leagueService.load(
        function(leagues) {
            $scope.leagues = leagues;
            
            if (leagues.length > 0) {
                $scope.league = leagues[0];
                $scope.loadMatches($scope.league);
            }
        }, 
        alertService.error);
}]);
