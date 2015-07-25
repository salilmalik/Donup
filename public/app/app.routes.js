angular.module('app.routes', [ 'ngRoute' ])

.controller('mainController', function($scope) {
})

.config(function($routeProvider, $locationProvider) {

	$routeProvider

	// home page route
	.when('/', {
		templateUrl : 'app/home.html',
		controller : 'mainController',
		controllerAs : 'main'
	})
	// login page
	.when('/login', {
		templateUrl : 'app/components/user/userlogin.html',
		controller : 'loginController',
		controllerAs : 'login'
	})
	// show all users
	.when('/users', {
		templateUrl : 'app/components/user/userregister.html',
		controller : 'registerController',
		controllerAs : 'register'
	});

	// get rid of the hash in the URL
	$locationProvider.html5Mode(true);

});