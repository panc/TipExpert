'use strict';

/* Use the User module (it is defined in the userServices.js) */

var user = angular.module('tipExpert.user');

user.controller('userController', ['$http', '$scope', function($http, $scope)  {

    $scope.roles = [
        { name: 'Admin', index: 1 },
        { name: 'User', index: 2 }
    ];

    $scope.save = function() {
        angular.forEach($scope.users, function(user) {
            $http.put('api/user/' + user._id, user)
                .success(function(data, status, headers, config) {
                    alert('success');
                })
                .error(function(data, status, headers, config) {
                    // todo 
                    alert(data);
                });
        });
    };
    
    $http.get('/api/user').
        success(function(data, status, headers, config) {
            $scope.users = data;
        })
        .error(function(data, status, headers, config) {
            // todo
            alert(data);
        });
}]);

user.controller('userProfileController', ['$http', '$scope', function($http, $scope)  {
    
}]);

user.controller('loginController', ['$window', '$scope', '$state', 'Auth', function($window, $scope, $state, Auth) {

    $scope.login = function() {
        $scope.submitted = true;
        
        Auth.login({
                email: $scope.loginForm.email.$modelValue,
                password: $scope.loginForm.password.$modelValue
            },
            function(res) {
                $state.go('home');
            },
            function(err) {
                // todo
                alert(data);
            });
    };

    $scope.loginOauth = function(provider) {
        $window.location.href = '/auth/' + provider;
    };
    
}]);

user.controller('navigationController', ['$scope', '$state', 'Auth', function($scope, $state, Auth) {

    $scope.user = Auth.user;

    $scope.logout = function() {
        Auth.logout(function() {
            $state.go('login');
        },
        function(err) {
            // todo
            alert(data);
        });
    };
    
}]);

user.controller('signUpController', ['$scope', '$state', 'Auth', function($scope, $state, Auth) {

    $scope.user = {
        name: '',
        email: '',
        password: ''
    };

    $scope.signup = function() {
        $scope.submitted = true;
        
        if ($scope.submitForm.$invalid)
            return;

        Auth.signup($scope.user, function() {
            $state.go('home');
        },
        function(err) {
            alert(err.errors);
        });
    };
    
}]);
