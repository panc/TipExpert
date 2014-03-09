'use strict';

/* Define the Match module */

var matchModule = angular.module('tipExpert.match', [ ]);

matchModule.factory('leagueService', ['$http', function($http) {

    var leagues = [];

    return {
        load: function(success, error) {
            $http.get('/api/leagues')
                .success(function(data, status, headers, config) {
                    leagues.length = 0;
                    angular.forEach(data, function(league) {
                        leagues.push(league);
                    });
                    
                    success();
                })
                .error(error);
        },
        leagues: leagues
    };
}]);