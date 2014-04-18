'use strict';

var game = angular.module('tipExpert.game');

game.factory('gameService', [
    '$http', 'Auth', function($http, Auth) {

        return {
            loadGamesForCurrentUser: function(success, error) {
                $http.get('/api/games/invited')
                    .success(function(data, status, headers, config) {
                        success(data);
                    })
                    .error(error);
            },

            loadGamesCreatedByCurrentUser: function(success, error) {
                $http.get('/api/games/created')
                    .success(function(data, status, headers, config) {
                        success(data);
                    })
                    .error(error);
            },

            load: function(gameId, success, error) {
                $http.get('/api/games/' + gameId)
                    .success(function(data, status, headers, config) {
                        success(data);
                    })
                    .error(error);
            },

            loadForEdit: function(gameId, success, error) {
                $http.get('/api/games/' + gameId + '/edit')
                    .success(function(data, status, headers, config) {
                        success(data);
                    })
                    .error(error);
            },

            create: function(newGame, success, error) {
                $http.post('/api/games', newGame)
                    .success(function(game, status, headers, config) {
                        success(game);
                    })
                    .error(error);
            },

            update: function(game, success, error) {
                $http.put('/api/games/' + game._id + '/edit', game)
                    .success(function(data, status, headers, config) {
                        success(data);
                    })
                    .error(error);
            },

            updateStake: function(gameId, newStake, success, error) {
                $http.put('/api/games/' + gameId + '/stake', { stake: newStake })
                    .success(function(data, status, headers, config) {
                        success();
                    })
                    .error(error);
            },

            updateTip: function(gameId, matchId, tip, success, error) {
                $http.put('/api/games/' + gameId + '/tip',
                    {
                        tip: tip.id,
                        match: matchId,
                        homeTip: tip.homeTip,
                        guestTip: tip.guestTip
                    })
                    .success(function(data, status, headers, config) {
                        success(data.homeTip, data.guestTip);
                    })
                    .error(error);
            },

            delete: function(game, error) {
                $http.delete('/api/games/' + game._id + '/edit')
                    .error(error);
            }
        };
    }
]);