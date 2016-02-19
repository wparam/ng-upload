(function(){
	///depend on lodash
	angular.module("myapp", []).
				directive("ac", ['$templateCache', '$sce', '$timeout', aotuComplete]);

	function aotuComplete($templateCache, $sce,  $timeout){	
		$templateCache.put('ac-upload.html', 
			['<div class="upload-container">',
                '<form class="form-inline">',
                    '<div class="ac-research-ops-panel class="form-group">',
                        '<button class="btn ac-btn-default">Choose File</button>',
                        '<input type="text" ng-model="uploadCtrl.filePath" class="form-control ac-research-manangername-txt"/>',
                        '<button class="btn ac-btn-default">Preview</button>',
                    '</div>',
                '</form>',
			'</div>'].join('')
			);
		return {
			restrict: "EA",
			scope: {
				
			},
			templateUrl: function(ele, attrs){
				return attrs.templateurl || 'default.html';
			},
			link: function($scope, ele,  attr){
				$scope.searchTerm = "";

				var inputCtrl = ele.find('input'),
					ulCtrl = ele.find('ul');
						
			}
		};
	}
})();

