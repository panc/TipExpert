'use strict';

/* Use the Match module */

var matchModule = angular.module('tipExpert.match');

matchModule.factory('matchService', ['$http', function($http) {

    return {
        load: function(league, success, error) {
            $http.get('/api/leagues/' + league._id + '/matches')
                .success(function(data, status, headers, config) {
                    
                    success(data);
                })
                .error(error);
        },
        
        create: function (newMatch, success, error) {
            $http.post('api/matches/', newMatch)
                .success(function(match, status, headers, config) {
                    success(match);
                })
                .error(error);
        },
        
        update: function (match, success, error) {
            $http.put('/api/matches/' + match._id, match)
                .success(function(data, status, headers, config) {
                    success();
                })
                .error(error);
        },
        
        delete: function (match, error) {
            $http.delete('api/matches/' + match._id)
                .success(function(data, status, headers, config) {
                    
                })
                .error(error);
        }
    };
}]);