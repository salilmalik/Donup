(function(){
var app = angular.module('donup');
app.directive('imageUpload',function () {
    return {        
        restrict: 'A',
        templateUrl:'app/directives/imageUpload.html' ,
        scope:{
                files : '='
        }, 
        controller: ['$scope', 'Upload','$timeout','ImageService', function ($scope, Upload,$timeout,imageService) {
            $scope.images={};
            $scope.$watch('files', function () {
            $scope.upload($scope.files);
		    $scope.userID='hello';
            });
            
            $scope.upload = function (files) {
	       	$scope.userID='hello';
                if (files && files.length) {
                    for (var i = 0; i < files.length; i++) {
                        var file = files[i];
                        Upload.upload({
                            url: 'api/image',
                            fields: {'userID': $scope.userID},
                            file: file
	       				}).progress(function (evt) {
                            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                            console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
                        }).success(function (data, status, headers, config) {
                            console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
                        }).error(function (data, status, headers, config) {
                            console.log('error status: ' + status);
                        })
                    }
                }
            };
            $scope.getUserImages = function(userId){
                userId ="hello";
                imageService.getUserImages(userId).success(function(data){
(function () {
    var app = angular.module('donup');
    app.directive('imageUpload', function () {
        return {
            restrict: 'A',
            templateUrl: 'app/directives/imageUpload.html',
            scope: {
                files: '='
            },
            controller: ['$scope', 'Upload', '$timeout', 'ImageService', '$cookies', '$location', function ($scope, Upload, $timeout, imageService, $cookies, $location) {
                $scope.images = {};
                $scope.userId = $cookies.get('userId');
                $scope.$watch('files', function () {
                    $scope.upload($scope.files);
                });
                imageService.getUserImages($scope.userId).success(function (data, status, headers, config) {
                    $scope.images = data;
                    angular.forEach($scope.images, function(image, key){
                        image.img = new Buffer(image.img.data).toString('base64')
                    
                    console.log($scope.images);
                    angular.forEach($scope.images, function (image, key) {
                        image.img = image.img.substring(8);
                        image.imgtn = image.imgtn.substring(8);
                    });
                })
            }
            $scope.getImageFromBinary = function(imageData){
                //success is the image binary,encoding it to base64 and bound to it
                var image=String.fromCharCode.apply(this,imageData);
                return image;
            }
            
            }]
                    $scope.img = $scope.images.img.substring(8);
                    $scope.imgtn = $scope.images.imgtn.substring(8);
                });

                $scope.upload = function (files) {
                    if (files && files.length) {
                        for (var i = 0; i < files.length; i++) {
                            var file = files[i];
                            Upload.upload({
                                url: 'api/image',
                                fields: { 'userId': $scope.userId },
                                file: file
                            }).progress(function (evt) {
                                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                                console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
                            }).success(function (data, status, headers, config) {
                                console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
                            }).error(function (data, status, headers, config) {
                                console.log('error status: ' + status);
                            })
                        }
                    }
                };

                $scope.getImageFromBinary = function (imageData) {
                    //success is the image binary,encoding it to base64 and bound to it
                    var image = String.fromCharCode.apply(this, imageData);
                    return image;
                }
                $scope.getImageUrl = function(imageId) {
                    var imageUrl = $location.$$protocol + "://" + $location.$$host + ":" + $location.$$port + "/displayImage/" + imageId;
                    return imageUrl;
                }
            } ]
        };
    });
})();