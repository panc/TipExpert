'use strict';

var game = angular.module('tipExpert.game');

game.factory('gameService', ['$http', 'Auth', function($http, Auth) {

    return {
        loadGamesForCurrentUser: function(success, error) {
            $http.get('/api/' + Auth.user.id + '/games/invited')
                .success(function(data, status, headers, config) {
                    success(data);
                })
                .error(error);
        },

        loadGamesCreatedByCurrentUser: function(success, error) {
            $http.get('/api/' + Auth.user.id + '/games/created')
                .success(function(data, status, headers, config) {
                    success(data);
                })
                .error(error);
        },

        load: function(gameId, success, error) {
            $http.get('/api/' + Auth.user.id + '/games/' + gameId)
                .success(function(data, status, headers, config) {
                    success(data);
                })
                .error(error);
        },

        loadForEdit: function(gameId, success, error) {
            $http.get('/api/' + Auth.user.id + '/games/' + gameId + '/edit')
                .success(function(data, status, headers, config) {
                    success(data);
                })
                .error(error);
        },

        create: function(newGame, success, error) {
            $http.post('/api/' + Auth.user.id + '/games', newGame)
                .success(function(game, status, headers, config) {
                    success(game);
                })
                .error(error);
        },

        update: function(game, success, error) {
            $http.put('/api/' + Auth.user.id + '/games/' + game._id + '/edit', game)
                .success(function(data, status, headers, config) {
                    success(data);
                })
                .error(error);
        },

        updateStake: function(gameId, newStake, success, error) {
            $http.put('/api/' + Auth.user.id + '/games/' + gameId + '/stake', { stake: newStake })
                .success(function(data, status, headers, config) {
                    success();
                })
                .error(error);
        },

        delete: function(game, error) {
            $http.delete('/api/' + Auth.user.id + '/games/' + game._id + '/edit')
                .error(error);
        }
    };
}]);