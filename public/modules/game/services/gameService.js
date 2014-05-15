'use strict';

var game = angular.module('tipExpert.game');

game.factory('gameService', ['$http', '$q', function ($http, $q) {

    return {
        loadGamesForCurrentUser: function() {
            var deferred = $q.defer();

            $http.get('/api/games/invited')
                .success(deferred.resolve)
                .error(deferred.reject);

            return deferred.promise;
        },

        loadGamesCreatedByCurrentUser: function() {
            var deferred = $q.defer();

            $http.get('/api/games/created')
                .success(deferred.resolve)
                .error(deferred.reject);

            return deferred.promise;
        },

        loadFinishedGamesForCurrentUser: function() {
            var deferred = $q.defer();

            $http.get('/api/games/finished')
                .success(deferred.resolve)
                .error(deferred.reject);

            return deferred.promise;
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

        updateStake: function(gameId, playerId, newStake, success, error) {
            $http.put('/api/games/' + gameId + '/stake',
                {
                    playerId: playerId,
                    stake: newStake
                })
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

        delete: function(game, success, error) {
            $http.delete('/api/games/' + game._id + '/edit')
                .success(success)
                .error(error);
        }
    };
}]);