'use strict';

var game = angular.module('tipExpert.game');

game.controller('SelectPlayersController', ['$scope', '$modalInstance', 'Auth', 'userService', 'gameService', 'alertService', 'game', function($scope, $modalInstance, Auth, userService, gameService, alertService, game) {
    
    var selectedplayers = game.players.slice(0);
    
    var areUserEqual = function(user, otherUser) {
        return user.name == otherUser.name;
    };

    $scope.toggleUserSelection = function(user) {
        user.selected = !user.selected;

        if (user.selected) {
            // if selected add the user to the player-list of the game
            var container = { user: user };
            selectedplayers.push(container);
        }
        else {
            // if not selected remove the user from the player-list of the game
            angular.forEach(selectedplayers, function(player) {
                
                if (areUserEqual(user, player.user)) {
                    var index = selectedplayers.indexOf(player);
                    selectedplayers.splice(index, 1);
                }
            });
        }
    };

    $scope.save = function() {

        game.players = selectedplayers;

        gameService.update(game,
            function(updatedGame) {
                $modalInstance.close(updatedGame);
            },
            alertService.error);
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };

    userService.loadFriendsForUser(Auth.currentUser)
        .then(function(users) {
            $scope.users = users;

            angular.forEach(users, function(user) {
                angular.forEach(selectedplayers, function(player) {

                    if (areUserEqual(user, player.user))
                        user.selected = true;
                });
            });
        })
        .catch(alertService.error);
}]);
