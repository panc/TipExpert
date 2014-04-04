'use strict';

var matchModule = angular.module('tipExpert.match');

matchModule.factory('leagueService', ['$http', function($http) {

    var leagues = [];

    return {
        load: function(success, error) {
            if (leagues.length > 0) {
                success(leagues);
                return;
            }

            $http.get('/api/leagues')
                .success(function(data, status, headers, config) {
                    leagues.length = 0;
                    angular.forEach(data, function(league) {
                        leagues.push(league);
                    });

                    success(leagues);
                })
                .error(error);
        },

        create: function(newLeague, success, error) {
            $http.post('api/leagues/', newLeague)
                .success(function(league, status, headers, config) {
                    leagues.push(league);
                    success(league);
                })
                .error(error);
        },

        update: function(league, success, error) {
            $http.put('/api/leagues/' + league._id, league)
                .success(function(newLeague, status, headers, config) {
                    success();
                })
                .error(error);
        },

        delete: function(league, error) {
            $http.delete('api/leagues/' + league._id)
                .success(function(data, status, headers, config) {
                    var index = leagues.indexOf(league);
                    leagues.splice(index, 1);
                })
                .error(error);
        }
    };
}]);