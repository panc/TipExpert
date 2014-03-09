'use strict';

/* Use the Match module */

var match = angular.module('tipExpert.match');

match.controller('matchController', ['$http', '$scope', 'leagueService', function($http, $scope, leagueService)  {

    $scope.leagues = leagueService.leagues;
    $scope.newLeague = { name: ''};

    // leagues

    $scope.addLeague = function() {
        
        $http.post('api/leagues/', $scope.newLeague)
            .success(function(data, status, headers, config) {
                data.editorEnabled= false ;
                $scope.leagues.push(data);
            })
            .error(function(data, status, headers, config) {
                // todo   
                alert(data);
            });
    };

    $scope.removeLeague = function(league) {
        $http.delete('api/leagues/' + league._id)
            .success(function(data, status, headers, config) {

                var index = $scope.leagues.indexOf(league);
                $scope.leagues.splice(index, 1);
            })
            .error(function(data, status, headers, config) {
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

        $http.put('/api/leagues/' + league._id, league)
            .success(function(data, status, headers, config) {
                league.editorEnabled = false;
            })
            .error(function(data, status, headers, config) {
                // todo
                alert(data);
            });
    };
    
    leagueService.load(function() {
            angular.forEach($scope.leagues, function(league) {
                league.editorEnabled = false;
            });
        },
        function(data) {
            // todo
            alert(data);
        });
}]);
