var app = angular.module('donup');
app.factory('UserService',['$http',function($http){
    return{
        registerUser:registerUser,
        loginUser:loginUser
    };
    
    
    function registerUser (user){
        return $http({
            method: 'POST',
            url: 'http://localhost:8080/api/user',
            data: 'name='+user.name+'&username='+user.username+'&password='+user.password,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        })
    };
    
    function loginUser (user){
        return $http({
            method: 'POST',
            url: 'http://localhost:8080/api/login',
            data: 'username='+user.username+'&password='+user.password,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        })
    };
}]);