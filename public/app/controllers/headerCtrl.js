(function(){
'use strict';

var app = angular.module('donup');
app.controller('HeaderCtrl',['$scope','$cookies',controller]);
function controller($scope,$cookies){
    $scope.loggedInUsername = $cookies.get('username');
    $scope.loggedInUserToken = $cookies.get('usertoken');
    
    $scope.logoutUser = function () {
        $cookies.put('username',undefined);
        $cookies.put('usertoken',undefined);
        $location.path('/');
    }
    
}

})();