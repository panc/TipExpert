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
