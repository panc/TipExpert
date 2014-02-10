'use strict';

/* Use the User module (it is defined in the userServices.js) */

var user = angular.module('tipExpert.user');

user.controller('userController', ['$http', '$scope', function($http, $scope)  {
    $http.get('/api/user').
        success(function(data, status, headers, config) {
            $scope.users = data;
        })
        .error(function(data, status, headers, config) {
            //alert('test'+ status);
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
            });
    };

    $scope.loginOauth = function(provider) {
        $window.location.href = '/auth/' + provider;
    };
    
}]);

user.controller('navigationController', ['$scope', '$state', 'Auth', function($scope, $state, Auth) {

    $scope.isLoggedIn = Auth.isLoggedIn();
    $scope.user = Auth.user;

    $scope.logout = function() {
        Auth.logout(function() {
            $state.go('login');
            $scope.isLoggedIn = Auth.isLoggedIn();
            $scope.user = Auth.user;
        },
        function(err) {
            // todo
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
