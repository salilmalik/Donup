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
                                $location.path("/imageLinks/"+data.objectId);
                           }).error(function (data, status, headers, config) {
                                console.log('error status: ' + status);
                            })
                        }
                    }
                };
         
            } ]
        };
    });
})();