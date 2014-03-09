'use strict';

/* Use the Match module */

var match = angular.module('tipExpert.match');

match.controller('matchController', ['$http', '$scope', 'leagueService', 'matchService', function($http, $scope, leagueService, matchService)  {

    $scope.leagues = leagueService.leagues;
    $scope.newLeague = { name: ''};

    // leagues

    $scope.addLeague = function() {

        leagueService.create($scope.newLeague,
            function(league) {
                league.editorEnabled = false;
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
        },
        function(data) {
            // todo
            alert(data);
        });
    
    
    // matches

    $scope.loadMatches = function(league) {
        matchService.load(league,
            function(matches) {
                $scope.matches = matches;
            },
            function(data) {
                // todo
                alert(data);
            });
    };
}]);
