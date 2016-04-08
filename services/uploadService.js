(function () {
    'use strict';

    angular.module('Any-upload')
        .service('AcFileUploadService', ['$http', '$q', AcFileUploadService]);
    
    function AcFileUploadService($http, $q){
        this.http = $http;
        this.$q = $q;
    }
    
    AcFileUploadService.prototype.upload = function(param){ //param:{data: xx, widget:xx}
        if(!param || !param.data) //todo log here
            return;
        var formData = new FormData();
        _.forEach(param.data, function(n, key){
            formData.append('file[' + key + ']', n);
        });
        var uploadUrl = "/api/files/upload/" + param.widget;
        var defer = this.$q.defer(),
            self = this;
        return this.http.post(uploadUrl, formData, {
            headers:{
                'Content-Type': undefined //'multipart/form-data'
            }
        });      
       
    };
    
})();