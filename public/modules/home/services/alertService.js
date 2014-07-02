'use strict';

var user = angular.module('tipExpert.user');

user.factory('alertService', ['$timeout', function($timeout) {

    var alerts = [];

    var addAlert = function(message, type) {

		var text = 'An error occoured';
		
		if (message != undefined) {
			if (message.msg != undefined)
				text = message.msg;
			else if (message.errors != undefined)
				text = message.errors[0];
			else
				text = message;
		}
			
        var item = { msg: text, type: type };

        item.timeout = $timeout(function() {
            closeAlert(item);
        }, 5000);  

        alerts.push(item);
    };

    var closeAlert = function(item) {

        if (item.timeout)
            $timeout.cancel(item.timeout);

        var index = alerts.indexOf(item);
        alerts.splice(index, 1);
    };

    return {
        alerts: alerts,

        error: function(message) {
            addAlert(message, 'warning');
        },

        info: function(message) {
            addAlert(message, 'success');
        },

        closeAlert: function(index) {
            closeAlert(alerts[index]);
        }
    };
}]);