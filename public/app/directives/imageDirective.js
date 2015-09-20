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
                    $scope.images = data;
                    angular.forEach($scope.images, function(image, key){
                        image.img = new Buffer(image.img.data).toString('base64')
                    
                    });
                })
            }
            $scope.getImageFromBinary = function(imageData){
                //success is the image binary,encoding it to base64 and bound to it
                var image=String.fromCharCode.apply(this,imageData);
                return image;
            }
            
            }]
        };
    });
})();