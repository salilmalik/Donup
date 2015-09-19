var app = angular.module('donup');
app.factory('ImageService',['$http',function($http,$scope){
     return{
       getImage : getImage,
       getUserImages:getUserImages
    };
    function getImage (imageId){
        return $http({
            method: 'GET',
            url: '/api/image/'+imageId,
        })
    };
    function getUserImages (userId){
        return $http({
            method: 'GET',
            url: '/api/image/getUserImages'+userId,
            url: '/api/image/getUserImages/'+userId,
        })

};
}]);