var app = angular.module('donup');
app.factory('ImageService',['$http',function($http,$scope){
     return{
       displayImage:displayImage
    };
     function displayImage(user) {
    return $http({
        method : 'GET',
        url : 'api/image/55f5c6fa36b5f47c0b14e3a1',
        headers : {
            'Content-Type' : 'application/json'
        },

    }).success(function(data, status, headers, config) {
        // success is the image binary,encoding it to base64 and bound to it
        result = data;
    })
};
}]);