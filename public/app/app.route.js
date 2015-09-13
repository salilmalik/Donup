(function(){
	'use strict';
	var app = angular.module('donup');
	app.config(function($httpProvider,$routeProvider,$locationProvider){
        
        // attach our auth interceptor to the http requests
        $httpProvider.interceptors.push('AuthInterceptor');
        
        $routeProvider
    .when('/wall',{
        controller:'WallCtrl',
        templateUrl:'app/views/wall.html'    
        })  
    .when('/',{
        controller:'LandingCtrl',
        templateUrl:'app/views/landing.html'    
    })    
	// home page route
	.when('/home', {
		controller : 'HomeCtrl',
		templateUrl : 'app/views/home.html'
	})	
    //User login & Register
    .when('/login', {
        controller : 'UserCtrl',
        templateUrl : 'app/views/login.html'   
    }) 
    .when('/register', {
        controller : 'UserCtrl',
        templateUrl : 'app/views/register.html'   
    })
    .when('/forgotPassword/', {
        controller : 'ForgotPasswordCtrl',
        templateUrl : 'app/views/forgotPassword.html'   
    })
    .when('/resetPassword/:param', {
        controller : 'ResetPasswordCtrl',
        templateUrl : 'app/views/resetPassword.html'   
    })
    .when('/profile', {
        controller : 'ProfileCtrl',
        templateUrl : 'app/views/profile.html'   
    })
    .when('/', {
        controller : 'LandingCtrl',
        templateUrl : 'app/views/landing.html'   
    })
      .when('/changePassword', {
        controller : 'changePasswordCtrl',
        templateUrl : 'app/views/changePassword.html'   
    });
	// get rid of the hash in the URL
	$locationProvider.html5Mode(true);
    });
	
	})();
