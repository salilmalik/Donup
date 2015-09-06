(function(){
'use strict';

var app = angular.module('donup');
app.controller('HeaderCtrl',['$scope','$cookies','$rootScope',controller]);
function controller($scope,$cookies,$rootScope){
    $scope.logoutUser = function () {
        $cookies.put('username',undefined);
        $cookies.put('usertoken',undefined);
        $rootScope.loggedInUsername = undefined;
    	$rootScope.loggedInUserToken = undefined;
    }
}
})();