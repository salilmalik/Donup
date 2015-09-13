(function(){
'use strict';
	var app = angular.module('donup');
    app.controller('ResetPasswordCtrl',['$scope',function($scope){
    	alert("reset password");
    	$scope.user={};
      $scope.user.password='hello';
      $scope.resetPassword = function(){
            alert("reset password called");
       	  return $http({
            method: 'POST',
            url: 'http://localhost:8080/api/resetPassword/87efe942e78de9a983acb7218542d6bf36c77086',
            data: $scope.user
        })
        }
    }]);
  })();