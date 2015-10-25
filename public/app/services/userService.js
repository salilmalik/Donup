var app = angular.module('donup');
app.factory('UserService',['$http',function($http){
    return{
        registerUser:registerUser,
        loginUser:loginUser,
        forgotPassword:forgotPassword,
        resetPassword:resetPassword,
        confirmEmailLink:confirmEmailLink
    };
  
    
    function registerUser (user){
        return $http({
            method: 'POST',
            url: '/api/user',
            data: user
        })
    };
    
    function loginUser (user){
        return $http({
            method: 'POST',
            url: '/api/login',
            data: user
        })
    };

     function forgotPassword (user){
        return $http({
            method: 'POST',
            url: '/api/forgotPassword',
            data: user
        })
    };

     function resetPassword (user){
        return $http({
            method: 'POST',
            url: '/api/resetPassword',
            data: user
        })
    };
    
     function confirmEmailLink(user){
        return $http({
            method: 'POST',
            url: '/api/confirmEmailLinks',
            data: user
        })
    };

    
}]);