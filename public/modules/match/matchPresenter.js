'use strict';

/* Define the User module */

var match = angular.module('tipExpert.match', []);

match.controller('matchController', ['$http', '$scope', function($http, $scope)  {

    $scope.roles = [
        { name: 'Admin', index: 1 },
        { name: 'User', index: 2 }
    ];

//    $scope.save = function() {
//        angular.forEach($scope.users, function(user) {
//            $http.put('api/user/' + user._id, user)
//                .success(function(data, status, headers, config) {
//                    alert('success');
//                })
//                .error(function(data, status, headers, config) {
//                    // todo   
//                });
//        });
//    };
//    
    $http.get('/api/leagues').
        success(function(data, status, headers, config) {
            $scope.leagues = data;
        })
        .error(function(data, status, headers, config) {
            // todo
            alert(data);
        });
}]);
