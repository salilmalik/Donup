  (function () {
      'use strict';
      var app = angular.module('donup');
      app.controller('UserCtrl', ['$scope', 'UserService', '$location', '$cookies','$window', function ($scope, userService, $location, $cookies,$window) {
          //Models    
          $scope.user = {};
          $scope.isUserRegistered = false;
          $scope.message;
          $scope.userToken;
          $scope.dataLoading = false;
   
          $scope.registerUser = function () {
              $scope.dataLoading = true;
              userService.registerUser($scope.user).success(function (data) {
                  if (data.message == 'User created!') {
                      $scope.isUserRegistered = true;
                      alert("Successfully Registered. Please login.");
                      $location.path('/');
                  }
                  $scope.message = data.message;
                  alert($scope.message);
                  $scope.user = {};
                  $scope.dataLoading = false;
              });
          }

          $scope.loginUser = function () {
              userService.loginUser($scope.user).success(function (data) {
                  $scope.dataLoading = true;
                  if (data.success == true) {
                      $cookies.put('usertoken', data.token);
                      $cookies.put('username', data.user.username);
                      $cookies.put('userId', data.user._id); 
                      $scope.message = data.message;
                      $scope.dataLoading = false;
                      $location.path('/');
                  }
                  $scope.message = data.message;
                  $scope.user.password = '';
                  $scope.dataLoading = false;
              });
          }

      } ]);
 app.directive('equals', function() {
        return {
            restrict : 'A', // only activate on element attribute
            require : '?ngModel', // get a hold of NgModelController
            link : function(scope, elem, attrs, ngModel) {
                if (!ngModel)
                    alert("NO MODEL");
                    return; // do nothing if no ng-model

                // watch own value and re-validate on change
                scope.$watch(attrs.ngModel, function() {
                      alert("validate");
                    validate();
                });

                // observe the other value and re-validate on change
                attrs.$observe('equals', function(val) {
                              alert("observe");
                    validate();
                });

                var validate = function() {
                    // values
                         alert("validate function");
                    var val1 = ngModel.$viewValue;
                    var val2 = attrs.equals;

                    // set validity
                    ngModel.$setValidity('equals', !val1 || !val2
                            || val1 === val2);
                };
            }
        }
    });
  })();