'use strict';

/* Use the Match module */

var match = angular.module('tipExpert.match');

match.controller('matchController', ['$http', '$scope', '$modal', 'leagueService', 'matchService', function($http, $scope, $modal, leagueService, matchService)  {

    $scope.selectedMatch = { homeTeam: '', guestTeam: '', dueDate: new Date()};
    $scope.leagues = leagueService.leagues;
    $scope.newLeague = { name: ''};

    // leagues

    $scope.addLeague = function() {

        leagueService.create($scope.newLeague,
            function(league) {
                league.editorEnabled = false;
                $scope.newLeague = "";
            }),
            function(data) {
                // todo   
                alert(data);
            };
    };

    $scope.removeLeague = function(league) {
        leagueService.delete(league,
            function(data) {
                // todo
                alert(data);
            });
    };

    $scope.editLeague = function(league) {
        league.editorEnabled = true;
        league.editableName = league.name;
    };
    
    $scope.cancelEditLeague = function(league) {
        league.editorEnabled = false;
    };
    
    $scope.saveLeague = function(league) {
        league.name = league.editableName;

        leagueService.update(league,
            function() {
                league.editorEnabled = false;
            },
            function() {
                // todo
                alert(data);
            });
    };
    
    leagueService.load(
        function() {
            angular.forEach($scope.leagues, function(league) {
                league.editorEnabled = false;
            });
            
            if ($scope.leagues.length > 0)
                $scope.loadMatches($scope.leagues[0]);
        },
        function(data) {
            // todo
            alert(data);
        });
    
    
    // matches

    $scope.loadMatches = function(league) {
        $scope.selectedLeague = league;
        
        matchService.load(league,
            function(matches) {
                $scope.matches = matches;
            },
            function(data) {
                // todo
                alert(data);
            });
    };
    
    $scope.saveMatch = function(match) {

        var error = function(data) { alert(data); /* todo */ };

        if (match._id) {
            matchService.update(match, function () { }, error);
        }
        else {
            matchService.create(match, function(newMatch) {
                $scope.matches.push(newMatch);
            }, error);
        }
    };

    $scope.addMatch = function() {
        var match = { homeTeam: 'Home', guestTeam: '', dueDate: Date.now(), leagueId: $scope.selectedLeague._id };
        $scope.editMatch(match);
    };
    
    $scope.editMatch = function(match) {
        
        var modalInstance = $modal.open({
            templateUrl: 'modules/match/views/editMatchDialog.html',
            controller: 'EditMatchController',
            resolve: {
                match: function() {
                    return match;
                }
            }
        });

        modalInstance.result.then(function(modifiedMatch) {

            $scope.saveMatch(modifiedMatch);

        }, function() {
            // canceld -> nothing to do
        });
    };
}]);

match.controller('EditMatchController', ['$scope', '$modalInstance', 'match', function($scope, $modalInstance, match) {

    $scope.match = match;

    $scope.ok = function() {
        $modalInstance.close($scope.match);
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
}]);