'use strict';

var game = angular.module('tipExpert.game');

game.controller('SelectPlayersController', ['$scope', '$modalInstance', 'Auth', 'userService', 'gameService', 'game', function($scope, $modalInstance, Auth, userService, gameService, game) {
    
    $scope.game = game;

    var areUserEqual = function(user, otherUser) {
        return user.name == otherUser.name;
    };

    $scope.toggleUserSelection = function(user) {
        user.selected = !user.selected;

        if (user.selected) {
            // if selected add the user to the player-list of the game
            var container = { user: user };
            $scope.game.players.push(container);
        }
        else {
            // if not selected remove the user from the player-list of the game
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
    
    userService.loadFriendsForUser(Auth.currentUser,
        function(users) {
            $scope.users = users;

            angular.forEach(users, function(user) {
                angular.forEach($scope.game.players, function(player) {

                    if (areUserEqual(user, player.user))
                        user.selected = true;
                });
            });

        },
        toast.error);
}]);
