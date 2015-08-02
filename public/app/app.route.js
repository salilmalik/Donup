(function(){
	'use strict';
	var app = angular.module('donup');
	app.config(function($httpProvider,$routeProvider,$locationProvider){
        
        // attach our auth interceptor to the http requests
        $httpProvider.interceptors.push('AuthInterceptor');
        
        $routeProvider

	// home page route
	.when('/', {
		controller : 'MainCtrl',
		templateUrl : 'app/home.html'
	})
	
	// show all users
	.when('/users', {
		controller : 'UserCtrl',
		templateUrl : 'app/views/userRegister.html'
	});

	// get rid of the hash in the URL
	$locationProvider.html5Mode(true);
    });
	
	})();
