
var MyMusicApp = angular.module("MyMusicApp",['ngRoute']);

MyMusicApp.run(['$rootScope', '$location', function($rootScope, $location) {
    $rootScope.$on('$routeChangeSuccess', function(evt, current, previous) {






 	}); 
}]);

MyMusicApp.config(function($routeProvider){
	$routeProvider
		.when('/template/rank/rank_pop.html',{
			templateUrl:'template/rank/rank_pop.html',
			controller:'Controller_rook1'
		})
		.when('/template/rank/rank_hot.html',{
			templateUrl:'template/rank/rank_hot.html',
			controller:'Controller_rook2'
		})
		.when('/template/rank/rank_new.html',{
			templateUrl:'template/rank/rank_new.html',
			controller:'Controller_rook3'
		})
		.when('/template/rank/rank_online.html',{
			templateUrl:'template/rank/rank_online.html',
			controller:'Controller_rook4'
		})
		.when('/template/rank/rank_hinterland.html',{
			templateUrl:'template/rank/rank_hinterland.html',
			controller:'Controller_rook5'
		})
		
		.when('/template/rank/rank_ht.html',{
			templateUrl:'template/rank/rank_ht.html',
			controller:'Controller_rook6'
		})
		.when('/template/rank/rank_EA.html',{
			templateUrl:'template/rank/rank_EA.html',
			controller:'Controller_rook7'
		})
		.when('/template/rank/rank_korea.html',{
			templateUrl:'template/rank/rank_korea.html',
			controller:'Controller_rook8'
		})
		.when('/template/rank/rank_JP.html',{
			templateUrl:'template/rank/rank_JP.html',
			controller:'Controller_rook9'
		})
		.when('/template/rank/rank_sell.html',{
			templateUrl:'template/rank/rank_sell.html',
			controller:'Controller_rook10'
		})
		
		.when('/template/rank/rank_Ksong.html',{
			templateUrl:'template/rank/rank_Ksong.html',
			controller:'Controller_rook11'
		})
		.when('/template/rank/rank_MV.html',{
			templateUrl:'template/rank/rank_MV.html',
			controller:'Controller_rook12'
		})
		.when('/template/rank/rank_MV.html',{
			templateUrl:'template/rank/rank_MV.html',
			controller:'Controller_rook13'
		})
		.when('/template/rank/rank_Mnet.html',{
			templateUrl:'template/rank/rank_Mnet.html',
			controller:'Controller_rook14'
		})
		.when('/template/rank/rank_Mnet.html',{
			templateUrl:'template/rank/rank_hinterland.html',
			controller:'Controller_rook15'
		})
		
		.when('/template/rank/rank_UK.html',{
			templateUrl:'template/rank/rank_UK.html',
			controller:'Controller_rook16'
		})
		.when('/template/rank/rank_JAPANESE.html',{
			templateUrl:'template/rank/rank_JAPANESE.html',
			controller:'Controller_rook17'
		})
		.when('/template/rank/rank_HK.html',{
			templateUrl:'template/rank/rank_HK.html',
			controller:'Controller_rook18'
		})
		.when('/template/rank/rank_HONGKONG.html',{
			templateUrl:'template/rank/rank_HONGKONG.html',
			controller:'Controller_rook19'
		})
		.when('/template/rank/rank_TW.html',{
			templateUrl:'template/rank/rank_TW.html',
			controller:'Controller_rook20'
		})
		.otherwise({redirectTo:'/template/rank/rank_pop.html'});
});

MyMusicApp.controller('MyMusic_con',function($scope){
	$(".RankM").click(function(){
		$(".RankM").css({background:"none"});
		$(this).css({background:"#1697CB"});
	});
});


