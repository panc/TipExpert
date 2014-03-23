'use strict';

var game = angular.module('tipExpert.game');

game.factory('gameService', ['$http', 'Auth', function($http, Auth) {

        return {
        load: function(success, error) {
            $http.get('/api/' + Auth.user.id + '/games')
                .success(function(data, status, headers, config) {
                    success(data);
                })
                .error(error);
        },
        
        create: function (newGame, success, error) {
            $http.post('/api/' + Auth.user.id + '/games', newGame)
                .success(function(game, status, headers, config) {
                    success(game);
                })
                .error(error);
        },
        
        update: function (match, success, error) {
            $http.put('/api/' + Auth.user.id + '/games' + match._id, match)
                .success(function(data, status, headers, config) {
                    success(match);
                })
                .error(error);
        },
        
        delete: function (match, error) {
            $http.delete('/api/' + Auth.user.id + '/games' + match._id)
                .error(error);
        }
    };
}]);