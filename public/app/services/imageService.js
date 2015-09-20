var app = angular.module('donup');
app.factory('ImageService',['$http',function($http,$scope){
     return{
       getImage : getImage
    };
    function getImage (imageId){
        return $http({
            method: 'GET',
            url: '/api/image/'+imageId
        })
    };

}]);