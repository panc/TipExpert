'use strict';

var user = angular.module('tipExpert.user');

user.factory('alertService', function() {

    var alerts = [];

    var addAlert = function(message, type) {
        alerts.push({ msg: message, type: type });
    };

    return {
        alerts: alerts,

        error: function(message) {
            addAlert(message, 'error');
        },

        info: function(message) {
            addAlert(message, 'success');
        },
    };
});