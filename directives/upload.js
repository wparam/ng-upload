(function(){
	angular.module("Any-upload")	
	.directive('acUpload', acUpload);

	acUpload.$inject = ['$templateCache', '$timeout', '$interval', 'GuidService', 'AcFileUploadService', 'AcFile'];
    
    /**
     * Example of use:
     * <div ac-upload 
     *      multiple="true"         --allow multiple files upload 
     *      show-path="true"        --show file path in textbox
     *      accept=".csv"           --accept file format patterns, some accepts are:
     *          ="text/plain"                 --.txt,
     *          ="application/vnd.ms-excel"   --.xls,
     *          ="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" --.xlsx
     *      ac-files="fc.files"     --for edit purpose, load files uploaded last time
     *      on-success="fc.onSuccess(files)"    --onSuccess upload callback
     *      on-error="fc.onError()"             --onError upload callback
     *      on-remove="fc.onRemove()">          --fires when click remove icon in the textbox, only works when showpath is on
     * </div>
     */
	function acUpload($templateCache, $timeout, $interval, GuidService, AcFileUploadService, AcFile){
		$templateCache.put('ac-research-upload.html', 
			['<div class="ac-upload-container">',
                '<form class="form-inline">',
                    '<div class="ops-panel form-group" ng-class="{\'has-feedback\':upCtrl.options.showPath}">',
                        '<label class="btn btn-primary filebtn" for="f{{::upCtrl.fileCtrlId}}">',
                            '<input id="f{{::upCtrl.fileCtrlId}}" type="file" ng-show="false">',
                            '<span>{{upCtrl.options.title}}</span>',                
                        '</label>',
                        '<input type="text" ng-readonly="true" ng-show="upCtrl.options.showPath" ng-model="upCtrl.fileName" class="form-control filepath"/>',
                        '<span ng-show="upCtrl.options.showPath && acFiles && acFiles.length>0" class="glyphicon glyphicon-remove-sign form-control-feedback remove-file" aria-hidden="true" title="Remove File" ng-click="upCtrl.remove()"></span>',
                        '<div class="progress" ng-show="upCtrl.progress.show">',
                            '<div class="progress-bar progress-bar-info progress-bar-striped" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" ng-style="{\'width\': upCtrl.progress.bar+\'%\'}">',
                                '<span class="sr-only">{{upCtrl.progress.bar}}% Complete (success)</span>',
                            '</div>',
                        '</div>',
                    '</div>',
                '</form>',
			'</div>'].join('')
			);
		var dir = {
			restrict: "EA",
			scope: {
                title: '@',
                accept: '@',
                widget: '@',
				multiple: '=',                
                showPath: '=',
                processRT: '=',
                acFiles: '=?',
                onSuccess : '&',
                onError : '&',
                onRemove: '&' 
			},
			templateUrl: function(ele, attrs){
				return attrs.templateurl || 'ac-research-upload.html';
			},
            controller: controller,
            controllerAs: 'upCtrl',
			link: link
		};
        function controller($scope){
            var vm = this;
            vm.scope = $scope;            
            vm.onSuccessCb = $scope.onSuccess;
            vm.onErrorCb = $scope.onError;
            vm.onRemoveCb = $scope.onRemove;
            vm.fileCtrlId = GuidService.guid();
            vm.options = {
                accept: $scope.accept || '',
                widget: $scope.widget || '',
                multiple: $scope.multiple || false,
                showPath: $scope.showPath || false,
                title: $scope.title || 'Choose File',
                processRT : $scope.processRT || false
            };
            vm.progress = { 
                bar: 0,
                show : false
            }; 
            vm.scope.$watch('acFiles', angular.bind(vm, vm.watchFiles));
            vm.scope.$on('$destroy', angular.bind(vm, vm.destroy));
            vm.pbar = new ProgressBar(vm.progress);
        }

        controller.prototype.reset = function(){
            var vm = this;
            vm.progress.bar = 0;
            vm.progress.show = false;     
            vm.acFiles = [];
            vm.scope.acFiles = [];
        };
        
        controller.prototype.watchFiles = function(nv, ov){
            if(!nv || nv === ov)
                return;
            this.loadFiles(nv);
        }

        controller.prototype.loadFiles = function(files){
            var vm = this;
            if(!files){
                vm.fileName = "";
                return;
            }
            if(files.length > 1)
                vm.fileName = "Multiple Files...";
            else if(files.length === 1 )
                vm.fileName = files[0].getDisplayName();
            else
                vm.fileName = "";
        };

        controller.prototype.processFiles = function(files){
            if(!files)
                return;
            var acfiles = []; 
            _.forEach(files, function(n, key){
                var nf = new AcFile(n.fileid, n.originalname, n.filename,
                    n.relaPath, n.size);
                acfiles.push(nf);
            }); 
            return acfiles;
        };
        
        controller.prototype.submit = function(filelist, resetfilecb){ //resetfile for upload file with diff content but same name
            var vm = this;
            vm.reset();
            vm.stopTime = vm.pbar.start(filelist);
            AcFileUploadService.upload({ data: filelist, widget: vm.options.widget || '' }).then(function(res){
                var retdata = res.data.files;
                var files = vm.processFiles(retdata);
                $timeout(function(){
                    vm.scope.acFiles = files;                    
                    vm.onSuccessCb({files: files});
                    if(typeof resetfilecb ==='function')
                        resetfilecb();
                });                
            }, function(res){
                vm.pbar.stop(); 
                vm.onErrorCb();
                resetfilecb();
            });
        };
        
        controller.prototype.remove = function(){
            var vm = this;
            vm.scope.acFiles = [];
            if(vm.onRemoveCb && typeof vm.onRemoveCb ==='function')
                vm.onRemoveCb();
        };

        controller.prototype.destroy = function(){
            if(angular.isDefined(this.stopTime)){//destroy timer
                $interval.cancel(this.stopTime);
                this.stopTime = undefined;
            }
        };  

        function link(scope, ele, attr, ctrl){
            var element = ele.find('input[type="file"]'),
                pathTxt = ele.find('input[type="text"]');
            if(ctrl.options.accept.length>0)
                element.attr('accept', ctrl.options.accept);
            if(ctrl.options.multiple)
                element.attr('multiple', 'multiple');
            pathTxt.bind('click', function(){
                element.trigger('click');
            });
            element.bind('change', function(){
                if(!element.val())
                    return;
                var filelist = element[0].files;
                ctrl.submit(filelist, function(){
                    element.val('');
                });
            });
        }

        /**
         * version 1 use dummy process, for tiny files no need xhr process
         * @param  {[type]}
         * @return {[type]}
         */
        function ProgressBar(progressBar){ 
            this.progressBar = progressBar;
            this.step = 20; //slow step by 5
            this.stopThreshold = 100 - this.step; //init by 0
            this.intervalTime = 200; //ms
            this.timer;
        }

        ProgressBar.prototype.start = function(files){
            var self = this,
                fileLength = files.length;
            self.progressBar.bar = self.step;
            self.progressBar.show = true;
            self.timer = $interval(function(){
                if(self.progressBar.bar > 0 )
                    self.progressBar.show = true;
                if(self.progressBar.bar === 100){
                    self.progressBar.show = false;
                    self.progressBar.bar = self.step;   
                    return;
                }       
                self.progressBar.bar += self.step;
            }, this.intervalTime, fileLength * 100/this.step);
               
        }

        ProgressBar.prototype.stop = function(){
            var self = this;
            if(angular.isDefined(this.timer)){
                $interval.cancel(this.timer);    
                this.timer = undefined;
            }
            $timeout(function(){
                self.progressBar.show = false;
                self.progressBar.bar = 0;
            },300);
        }

        return dir;
	}
})();

