(function(){
	///depend on lodash
	angular.module("myapp", []).
				directive("ac", ['$templateCache', '$sce', '$timeout', aotuComplete]);

	function aotuComplete($templateCache, $sce,  $timeout){	
		$templateCache.put('default.html', 
			['<div class="autocomplete-container">',
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

