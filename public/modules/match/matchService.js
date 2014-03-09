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
        
        create: function (newLeague, success, error) {
            $http.post('api/leagues/', newLeague)
                .success(function(league, status, headers, config) {
                    leagues.push(league);
                    success(league);
                })
                .error(error);
        },
        
        update: function (league, success, error) {
            $http.put('/api/leagues/' + league._id, league)
                .success(function(data, status, headers, config) {
                    success();
                })
                .error(error);
        },
        
        delete: function (league, error) {
            $http.delete('api/leagues/' + league._id)
                .success(function(data, status, headers, config) {
                    var index = leagues.indexOf(league);
                    leagues.splice(index, 1);
                })
                .error(error);
        }
    };
}]);