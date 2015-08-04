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
	
	// User Registration 
	.when('/register', {
		controller : 'UserCtrl',
		templateUrl : 'app/views/userRegister.html'
	})
        //User login
    .when('/login', {
        controller : 'UserCtrl',
        templateUrl : 'app/views/userLogin.html'   
    });

	// get rid of the hash in the URL
	$locationProvider.html5Mode(true);
    });
	
	})();
