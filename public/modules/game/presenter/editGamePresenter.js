'use strict';

var game = angular.module( 'tipExpert.game' );

game.controller( 'editGameController', ['$scope', '$state', '$stateParams', '$modal', 'gameService', 'alertService', function ( $scope, $state, $stateParams, $modal, gameService, alertService ) {

    $scope.game = {};

    if ( $stateParams.gameId ) {
        gameService.loadForEdit( $stateParams.gameId,
            function ( game ) {
                $scope.game = game;
            },
            alertService.error );
    }

    $scope.save = function () {
        $scope.submitted = true;

        if ( $scope.submitForm.$invalid )
            return;

        gameService.update( $scope.game,
            function ( updatedGame ) {
                $scope.game = updatedGame;
                alertService.info( 'Successfully saved!' );
            },
            alertService.error );
    };

    $scope.delete = function () {
        if ( $scope.game.isFinished ) {
            alertService.error( 'Can not delete a finished game!' );
            return;
        }

        gameService.delete( $scope.game, function () {
            alertService.info( 'Successfully deleted!' );
            $state.go( 'games.overview' );
        },
            alertService.error );
    };

    $scope.addMatch = function () {
        var modalInstance = $modal.open( {
            templateUrl: '/modules/game/views/selectMatchesDialog.html',
            controller: 'SelectMatchesController',
            resolve: {
                game: function () {
                    return $scope.game;
                }
            }
        });

        modalInstance.result.then( function ( updatedGame ) {
            $scope.game = updatedGame;
            alertService.info( 'Changes successfully saved!' );

        }, function () {
                // canceld -> nothing to do
            });
    };

    $scope.addPlayer = function () {
        var modalInstance = $modal.open( {
            templateUrl: '/modules/game/views/selectPlayersDialog.html',
            controller: 'SelectPlayersController',
            resolve: {
                game: function () {
                    return $scope.game;
                }
            }
        });

        modalInstance.result.then( function ( updatedGame ) {
            $scope.game = updatedGame;
            alertService.info( 'Changes successfully saved!' );

        }, function () {
                // canceld -> nothing to do
            });
    };
}] );
