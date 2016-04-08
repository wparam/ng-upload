(function () {
    'use strict';

    angular.module('Any-upload')
        .factory('AcFile', AcFileFactory);
    
    function AcFileFactory(){
        return function(fileId, fsrcName, ftgtName, ffullName, fsize){
            return new AcFile(fileId, fsrcName, ftgtName, ffullName, fsize);
        }     
    }
    
    
    /**
     * @param  {any} fileId
     * @param  {any} fsrcName
     * @param  {any} ftgtName
     * @param  {any} ffullName
     * @param  {any} fsize
     */
    function AcFile(fileId, fsrcName, ftgtName, ffullName, fsize ){
        this.fileId = fileId;
        this.fileSourceName = fsrcName;
        this.fileTargetName = ftgtName; 
        this.fileFullName = ffullName;
        this.fileSize = fsize;
    };
    
    AcFile.prototype.getFileId = function(){
        return this.fileId;
    };
    
    AcFile.prototype.getDisplayName = function(){
        return this.fileSourceName;
    };
    
    AcFile.prototype.getTargetName = function(){
        return this.fileTargetName;
    };   
    
    AcFile.prototype.getFullName = function(){
        return this.fileFullName;
    };
    
    AcFile.prototype.getFileSize = function(){
        return this.fileSize;
    };
})();