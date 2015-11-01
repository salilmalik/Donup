var app = angular.module('donup');
app.factory('ImageService',['$http',function($http){
     return{
       getImage: getImage,
       getUserImages: getUserImages,
       getmultiImage:getmultiImage
    };
    function getImage (imageId){
        console.log("GET IMAGE CALLED");
        return $http({
            method: 'GET',
            url: '/api/image/'+imageId
        })
    };
     function getUserImages (userId){
        return $http({
            method: 'GET',
            url: '/api/image/getUserImages/'+userId
        })
    };
     function getmultiImage (multiImage){
        return $http({
            method: 'GET',
            url: '/api/image/multiImage/'+multiImage
          
        })
    };

}]);