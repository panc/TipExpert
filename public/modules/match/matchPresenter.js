'use strict';

/* Define the User module */

var match = angular.module('tipExpert.match', []);

match.controller('matchController', ['$http', '$scope', function($http, $scope)  {

    $scope.leagues = [];
    $scope.newLeague = { name: ''};

    $scope.addLeague = function() {
        
        $http.post('api/leagues/', $scope.newLeague)
            .success(function(data, status, headers, config) {
                $scope.leagues.push({ item: data, editorEnabled: false });
            })
            .error(function(data, status, headers, config) {
                // todo   
                alert(data);
            });
    };

    $scope.removeLeague = function(league) {

        $http.delete('api/leagues/' + league.item._id)
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
        league.editableName = league.item.name;
    };
    
    $scope.cancelEditLeague = function(league) {

        league.editorEnabled = false;
    };
    
    $scope.saveLeague = function(league) {

        league.item.name = league.editableName;

        $http.put('/api/leagues/' + league.item._id, league.item)
            .success(function(data, status, headers, config) {
            
                league.editorEnabled = false;
            })
            .error(function(data, status, headers, config) {
                // todo
                alert(data);
            });
    };
    
    $http.get('/api/leagues')
        .success(function(data, status, headers, config) {

            var leagues = [];

            angular.forEach(data, function(league) {
                leagues.push({ item: league, editorEnabled: false });
            });
            
            $scope.leagues = leagues;
        })
        .error(function(data, status, headers, config) {
            // todo
            alert(data);
        });
}]);
