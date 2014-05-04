'use strict';

var match = angular.module('tipExpert.match');

match.controller('matchController', [
    '$scope', '$modal', 'leagueService', 'matchService', 'alertService', function($scope, $modal, leagueService, matchService, alertService) {

        $scope.selectedMatch = { homeTeam: '', guestTeam: '', dueDate: new Date() };
        $scope.leagues = [];
        $scope.newLeague = { name: '' };

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
                alertService.error);
        };

        // matches

        $scope.loadMatches = function(league) {
            $scope.selectedLeague = league;

            matchService.load(league,
                function(matches) {
                    $scope.matches = matches;
                },
                alertService.error);
        };

        $scope.addMatch = function() {
            var match = { homeTeam: '', guestTeam: '', dueDate: Date.now(), league: $scope.selectedLeague._id };
            showEditMatchDialog(match, function(newMatch) {
                $scope.matches.push(newMatch);
            });
        };

        $scope.editMatch = function(match) {
            showEditMatchDialog(match);
        };

        var showEditMatchDialog = function(match, onSavedCallback) {
            var modalInstance = $modal.open({
                templateUrl: '/modules/match/views/editMatchDialog.html',
                controller: 'EditMatchController',
                resolve: {
                    match: function() {
                        return match;
                    }
                }
            });

            modalInstance.result.then(function(newOrUpdatedMatch) {

                if (onSavedCallback)
                    onSavedCallback(newOrUpdatedMatch);

            }, function() {
                // canceld -> nothing to do
            });
        };

        leagueService.load(
            function(leagues) {
                $scope.leagues = leagues;

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
    }
]);