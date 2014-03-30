'use strict';

var game = angular.module('tipExpert.game');

game.controller('SelectPlayersController', ['$scope', '$modalInstance', 'userService', 'gameService', 'game', function($scope, $modalInstance, userService, gameService, game) {
    
    $scope.game = game;

    var areUserEqual = function(user, otherUser) {
        return user.username == otherUser.username;
    };

    $scope.toggleMatchSelection = function(user) {
        user.selected = !user.selected;

        if (user.selected) {
            // if selected add the match to the match-list of the game
            var container = { user: user };
            $scope.game.players.push(container);
        }
        else {
            // if not selected remove the match from the match-list of the game
            angular.forEach($scope.game.players, function(player) {
                
                if (areUserEqual(user, player.user)) {
                    var index = $scope.game.players.indexOf(player);
                    $scope.game.players.splice(index, 1);
                }
            });
        }
    };

    $scope.save = function() {

        gameService.update(game,
            function(updatedGame) {
                $modalInstance.close(updatedGame);
            },
            toast.error);
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
    
    userService.loadFriends(
        function(users) {
            $scope.users = users;

            angular.forEach(users, function(user) {
                angular.forEach($scope.game.players, function(player) {

                    if (areUserEqual(users, player.user))
                        match.selected = true;
                });
            });

        },
        toast.error);
}]);
