(function() {
	'use strict';

	var app = angular.module('donup');
	app.controller('UploadCtrl', [ '$scope','$rootScope','$cookies', controller ]);
	function controller($scope, $rootScope, $cookies) {
		$rootScope.loggedInUserToken=$cookies.get('usertoken');
		$rootScope.loggedInUsername=$cookies.get('username');
if($cookies.get('userId')===undefined){
	console.log('A');
		$rootScope.loggedInUsername = $cookies.put('username', undefined);
		$rootScope.loggedInUserToken = $cookies.put('usertoken', undefined);
	}
	}

})();