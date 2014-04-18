'use strict';

var game = angular.module('tipExpert.game');

game.controller('gameController', ['$scope', '$modal', '$stateParams', 'gameService', function($scope, $modal, $stateParams, gameService) {
    
    $scope.game = { };
    $scope.submitted = true;
    $scope.minStake = 0.0;
    $scope.stake = 0.0;
    $scope.editStake = false;

    $scope.cancelEditStake = function() {
        $scope.stake = $scope.game.player.stake;
        $scope.editStake = false;
    };

    $scope.saveStake = function() {
        gameService.updateStake($scope.game.id, $scope.game.player.id, $scope.stake, 
            function() {
                $scope.game.player.stake = $scope.stake;
                $scope.editStake = false;
            }, 
            toast.error);
    };

    $scope.saveTip = function(tip) {

        gameService.updateTip($scope.game.id, tip.match, tip, 
            function(homeTip, guestTip) {
                tip.oldHomeTip = homeTip;
                tip.oldGuestTip = guestTip;

                tip.showSaveButton = false;
            }, 
            toast.error);
    };

    $scope.cancelTipEditing = function(tip) {
        
        tip.homeTip = tip.oldHomeTip;
        tip.guestTip = tip.oldGuestTip;

        tip.showSaveButton = false;
    };

    if ($stateParams.gameId) {
        gameService.load($stateParams.gameId,
            function(game) {
                $scope.game = game;
                $scope.minStake = game.minStake;
                $scope.stake = game.player.stake;
            },
            toast.error);
    }
}]);

