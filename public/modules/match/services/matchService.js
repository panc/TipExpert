'use strict';

var matchModule = angular.module('tipExpert.match');

matchModule.factory('matchService', ['$http', function($http) {

    // todo:
    // use cache for the matches...

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
                .success(function(updatedMatch, status, headers, config) {
                    success(updatedMatch);
                })
                .error(error);
        },
        
        delete: function (match, error) {
            $http.delete('api/matches/' + match._id)
                .error(error);
        }
    };
}]);