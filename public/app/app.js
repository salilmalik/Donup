angular.module('donup',['ngAnimate','app.routes', 'authService','userLoginController', 'userRegisterController', 'userRegisterService',])

 // application configuration to integrate token into requests
 .config(function($httpProvider) {
 
   // attach our auth interceptor to the http requests
   $httpProvider.interceptors.push('AuthInterceptor');
 
 });