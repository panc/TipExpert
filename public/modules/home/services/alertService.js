'use strict';

var user = angular.module('tipExpert.user');

user.factory('alertService', function() {

    var alerts = [];

    var addAlert = function(message, type) {
        alerts.push({ msg: message, type: type });

        // todo: add timer to close alert...
    };

    return {
        alerts: alerts,

        error: function(message) {
            addAlert(message, 'error');
        },

        info: function(message) {
            addAlert(message, 'success');
        },

        closeAlert: function(index) {
            alerts.splice(index, 1);
        }
    };
});