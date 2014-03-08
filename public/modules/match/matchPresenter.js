'use strict';

/* Define the User module */

var match = angular.module('tipExpert.match', []);

match.controller('matchController', ['$http', '$scope', function($http, $scope)  {

    $scope.leagues = [];
    $scope.newLeague = { name: ''};

    $scope.addLeague = function() {
        
        $http.post('api/leagues/', $scope.newLeague)
            .success(function(data, status, headers, config) {
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
    
    $http.get('/api/leagues').
        success(function(data, status, headers, config) {
            $scope.leagues = data;
        })
        .error(function(data, status, headers, config) {
            // todo
            alert(data);
        });
}]);
