(function() {
	'use strict';

	var app = angular.module('donup');
	app.controller('HeaderCtrl', [ '$scope', '$cookies', '$rootScope',
			controller ]);
	function controller($scope, $cookies, $rootScope) {
		$rootScope.loggedInUsername = $cookies.put('username', undefined);
		$rootScope.loggedInUserToken = $cookies.put('usertoken', undefined);
		$scope.logoutUser = function() {
			$cookies.put('username', undefined);
			$cookies.put('username', undefined);
			$cookies.put('userId', undefined);
			$rootScope.loggedInUsername = undefined;
			$rootScope.loggedInUserToken = undefined;
		}
	}
})();