


var CarouselApp=angular.module("CarouselApp",['ngRoute']);

CarouselApp.run(['$rootScope', '$location', function($rootScope, $location) {
    $rootScope.$on('$routeChangeSuccess', function(evt, current, previous) {
      	var buttons = document.getElementById("buttons").getElementsByTagName('span');
      	for(var i = 0 ;i<buttons.length;i++){
      		if(i==0){
      			buttons[i].className="on"
      		}else{
				buttons[i].className='';
			}
		}
      	var container = document.getElementById("container");
	
	
	var prev = document.getElementById("prev");
	var next = document.getElementById("next");
	var home_carousel_bg = document.getElementById("home_carousel_bg");
	var index = 1;
	var animated = false;
	var timer;
	
	//按钮样式清空
	function showButton(){
		//先清空按钮的原来的样式
		for(var i = 0 ;i<buttons.length;i++){
			if(buttons[i].className=="on"){
				buttons[i].className='';
			}
		}
		//将现在选中的按钮加上样式
		buttons[index-1].className="on";
	}
	
	//动画
	function animate(offset){//offset是正数说明向向左滑动，点击左边按钮，是负数说明向右滑动，点击了右边按钮
		var list = document.getElementById("list");
		animated = true;//有新的坐标，动画开始
		var newleft = parseInt(list.style.left)+offset;//新坐标
		var time =500;//时间间隔
		var interval=10;//计时器时间
		var speed = offset/(time/interval);//速度，每次计时器跑动的距离
		
		function go(){
			//speed<0 && parseInt(list.style.left)>newleft说明图像向右边滑动
			if(speed<0 && parseInt(list.style.left)>newleft || speed>0 && parseInt(list.style.left)<newleft){//只要左边还不达到新坐标的要求，就一直进行go函数
				list.style.left=parseInt(list.style.left)+speed+'px';//每次移动的左边距离，并赋值新的left值
				
				setTimeout(go,interval);
			}else{
				console.log(list.style.left);
				animated=false;//达到坐标要求，动画结束,不跑了
				list.style.left=newleft+'px';//赋予新值,防止计算过程中约掉的数值产生偏差
					if(newleft>-1200){
						list.style.left=-3600+'px';
					}
					if(newleft<-3600){
						list.style.left=-1200+'px';
					}
			}
		}
		go();//一开始执行的go函数，引进递归函数内
		
	}
	
	
//	function play(){
//		timer = setInterval(function(){
//			next.onclick();
//		},3000);
//	}
//	function stop(){
//		clearInterval(timer);
//	}
	
	next.onclick=function(){
		if(!animated){
			index+=1;
			if(index>3){
				index=1;
			}
			showButton();
			animate(-1200);
		}
	}
	prev.onclick =function(){
		if(!animated){
			index-=1;
			if(index<1){
				index=3;
			}
			showButton();
			animate(1200);
		}
	}
	
	//为按钮添加点击事件
	for(var i=0;i<buttons.length;i++){
		buttons[i].onclick=function(){
			if(this.className=='on'){//点中的是当前图是，不做任何事情
				return;
			}
			
			if(!animated){//当前动画播放完了之后，执行此次变动
				var myIndex  = parseInt(this.getAttribute('index'));//获得现在按下的按钮的index属性的值
				var offset = -1200*(myIndex-index);//按下按钮的index坐标减去现在轮播到的按钮的坐标；
				index = myIndex;//将改动之后的索引坐标换成现在的坐标
				animate(offset);
				showButton();//通过新得到的坐标改变样式
			}
			
		}
	}
 	}); 
}]);

CarouselApp.config(function($routeProvider){
	$routeProvider
		.when('/',{
			templateUrl:'template/tpls_home/home_All.html',
			controller:'Carousel_controller_All'
		})
		.when('/template/tpls_home/home_China.html',{
			templateUrl:'template/tpls_home/home_China.html',
			controller:'Carousel_controller_China'
		})
		.when('/template/tpls_home/home_E&A.html',{
			templateUrl:'template/tpls_home/home_E&A.html',
			controller:'Carousel_controller_E&A'
		})
		.when('/template/tpls_home/home_Korea.html',{
			templateUrl:'template/tpls_home/home_Korea.html',
			controller:'Carousel_controller_Korea'
		})
		.when('/template/tpls_home/home_Japanese.html',{
			templateUrl:'template/tpls_home/home_Japanese.html',
			controller:'Carousel_controller_Japanese'
		})
		.otherwise({redirectTo:'/'});
});

CarouselApp.controller('Carousel_controller_All',function($scope,$http){
	$scope.carousels1=[];
	$scope.carousels2=[];
	$scope.carousels3=[];
	$http.get('data/All.json')
		.then(function(response){
			$scope.Data=response.data;
			for(var i=0;i<12;++i){
				if(i>=0&&i<=3){
					$scope.carousels1.push($scope.Data[i]);
				}else if(i>=4 && i<=7){
					$scope.carousels2.push($scope.Data[i]);
				}else{
					$scope.carousels3.push($scope.Data[i]);
				}
			}
		});
	//点击事件
	$scope.allimg1=function(index){
		if(window.localStorage.playIsOpen=="true"){
			if(window.localStorage.songID){
				window.localStorage.removeItem("songID");
			}
			window.localStorage.songID=$scope.carousels1[index].songId;
		}else{
			if(window.localStorage.songID){
				window.localStorage.removeItem("songID");
			}
			window.localStorage.songID=$scope.carousels1[index].songId;
			window.open("player.html");
			window.localStorage.playIsOpen="true";
		}
	}
	$scope.allimg2=function(index){
		if(window.localStorage.playIsOpen=="true"){
			if(window.localStorage.songID){
				window.localStorage.removeItem("songID");
			}
			window.localStorage.songID=$scope.carousels2[index].songId;
		}else{
			if(window.localStorage.songID){
				window.localStorage.removeItem("songID");
			}
			window.localStorage.songID=$scope.carousels2[index].songId;
			window.open("player.html");
			window.localStorage.playIsOpen="true";
		}
	}
	$scope.allimg3=function(index){
		if(window.localStorage.playIsOpen=="true"){
			if(window.localStorage.songID){
				window.localStorage.removeItem("songID");
			}
			window.localStorage.songID=$scope.carousels3[index].songId;
		}else{
			if(window.localStorage.songID){
				window.localStorage.removeItem("songID");
			}
			window.localStorage.songID=$scope.carousels3[index].songId;
			window.open("player.html");
			window.localStorage.playIsOpen="true";
		}
	}
});

CarouselApp.controller('Carousel_controller_China',function($scope,$http){
	$scope.carousels1=[];
	$scope.carousels2=[];
	$scope.carousels3=[];
	$http.get('data/China.json')
		.then(function(response){
			$scope.Data=response.data;
			for(var i=0;i<12;++i){
				if(i>=0&&i<=3){
					$scope.carousels1.push($scope.Data[i]);
				}else if(i>=4 && i<=7){
					$scope.carousels2.push($scope.Data[i]);
				}else{
					$scope.carousels3.push($scope.Data[i]);
				}
			}
		});
	//点击事件
	$scope.allimg1=function(index){
		if(window.localStorage.playIsOpen=="true"){
			if(window.localStorage.songID){
				window.localStorage.removeItem("songID");
			}
			window.localStorage.songID=$scope.carousels1[index].songId;
		}else{
			if(window.localStorage.songID){
				window.localStorage.removeItem("songID");
			}
			window.localStorage.songID=$scope.carousels1[index].songId;
			window.open("player.html");
			window.localStorage.playIsOpen="true";
		}
	}
	$scope.allimg2=function(index){
		if(window.localStorage.playIsOpen=="true"){
			if(window.localStorage.songID){
				window.localStorage.removeItem("songID");
			}
			window.localStorage.songID=$scope.carousels2[index].songId;
		}else{
			if(window.localStorage.songID){
				window.localStorage.removeItem("songID");
			}
			window.localStorage.songID=$scope.carousels2[index].songId;
			window.open("player.html");
			window.localStorage.playIsOpen="true";
		}
	}
	$scope.allimg3=function(index){
		if(window.localStorage.playIsOpen=="true"){
			if(window.localStorage.songID){
				window.localStorage.removeItem("songID");
			}
			window.localStorage.songID=$scope.carousels3[index].songId;
		}else{
			if(window.localStorage.songID){
				window.localStorage.removeItem("songID");
			}
			window.localStorage.songID=$scope.carousels3[index].songId;
			window.open("player.html");
			window.localStorage.playIsOpen="true";
		}
	}
});


CarouselApp.controller('Carousel_controller_E&A',function($scope,$http){
	$scope.carousels1=[];
	$scope.carousels2=[];
	$scope.carousels3=[];
	$http.get('data/E&A.json')
		.then(function(response){
			$scope.Data=response.data;
			for(var i=0;i<12;++i){
				if(i>=0&&i<=3){
					$scope.carousels1.push($scope.Data[i]);
				}else if(i>=4 && i<=7){
					$scope.carousels2.push($scope.Data[i]);
				}else{
					$scope.carousels3.push($scope.Data[i]);
				}
			}
		});
	//点击事件
	$scope.allimg1=function(index){
		if(window.localStorage.playIsOpen=="true"){
			if(window.localStorage.songID){
				window.localStorage.removeItem("songID");
			}
			window.localStorage.songID=$scope.carousels1[index].songId;
		}else{
			if(window.localStorage.songID){
				window.localStorage.removeItem("songID");
			}
			window.localStorage.songID=$scope.carousels1[index].songId;
			window.open("player.html");
			window.localStorage.playIsOpen="true";
		}
	}
	$scope.allimg2=function(index){
		if(window.localStorage.playIsOpen=="true"){
			if(window.localStorage.songID){
				window.localStorage.removeItem("songID");
			}
			window.localStorage.songID=$scope.carousels2[index].songId;
		}else{
			if(window.localStorage.songID){
				window.localStorage.removeItem("songID");
			}
			window.localStorage.songID=$scope.carousels2[index].songId;
			window.open("player.html");
			window.localStorage.playIsOpen="true";
		}
	}
	$scope.allimg3=function(index){
		if(window.localStorage.playIsOpen=="true"){
			if(window.localStorage.songID){
				window.localStorage.removeItem("songID");
			}
			window.localStorage.songID=$scope.carousels3[index].songId;
		}else{
			if(window.localStorage.songID){
				window.localStorage.removeItem("songID");
			}
			window.localStorage.songID=$scope.carousels3[index].songId;
			window.open("player.html");
			window.localStorage.playIsOpen="true";
		}
	}
});


CarouselApp.controller('Carousel_controller_Korea',function($scope,$http){
	$scope.carousels1=[];
	$scope.carousels2=[];
	$scope.carousels3=[];
	$http.get('data/Korea.json')
		.then(function(response){
			$scope.Data=response.data;
			for(var i=0;i<12;++i){
				if(i>=0&&i<=3){
					$scope.carousels1.push($scope.Data[i]);
				}else if(i>=4 && i<=7){
					$scope.carousels2.push($scope.Data[i]);
				}else{
					$scope.carousels3.push($scope.Data[i]);
				}
			}
		});
	//点击事件
	$scope.allimg1=function(index){
		if(window.localStorage.playIsOpen=="true"){
			if(window.localStorage.songID){
				window.localStorage.removeItem("songID");
			}
			window.localStorage.songID=$scope.carousels1[index].songId;
		}else{
			if(window.localStorage.songID){
				window.localStorage.removeItem("songID");
			}
			window.localStorage.songID=$scope.carousels1[index].songId;
			window.open("player.html");
			window.localStorage.playIsOpen="true";
		}
	}
	$scope.allimg2=function(index){
		if(window.localStorage.playIsOpen=="true"){
			if(window.localStorage.songID){
				window.localStorage.removeItem("songID");
			}
			window.localStorage.songID=$scope.carousels2[index].songId;
		}else{
			if(window.localStorage.songID){
				window.localStorage.removeItem("songID");
			}
			window.localStorage.songID=$scope.carousels2[index].songId;
			window.open("player.html");
			window.localStorage.playIsOpen="true";
		}
	}
	$scope.allimg3=function(index){
		if(window.localStorage.playIsOpen=="true"){
			if(window.localStorage.songID){
				window.localStorage.removeItem("songID");
			}
			window.localStorage.songID=$scope.carousels3[index].songId;
		}else{
			if(window.localStorage.songID){
				window.localStorage.removeItem("songID");
			}
			window.localStorage.songID=$scope.carousels3[index].songId;
			window.open("player.html");
			window.localStorage.playIsOpen="true";
		}
	}
});

CarouselApp.controller('Carousel_controller_Japanese',function($scope,$http){
	$scope.carousels1=[];
	$scope.carousels2=[];
	$scope.carousels3=[];
	$http.get('data/Japanese.json')
		.then(function(response){
			$scope.Data=response.data;
			for(var i=0;i<12;++i){
				if(i>=0&&i<=3){
					$scope.carousels1.push($scope.Data[i]);
				}else if(i>=4 && i<=7){
					$scope.carousels2.push($scope.Data[i]);
				}else{
					$scope.carousels3.push($scope.Data[i]);
				}
			}
		});
	
	$scope.allimg1=function(index){
		if(window.localStorage.playIsOpen=="true"){
			if(window.localStorage.songID){
				window.localStorage.removeItem("songID");
			}
			window.localStorage.songID=$scope.carousels1[index].songId;
		}else{
			if(window.localStorage.songID){
				window.localStorage.removeItem("songID");
			}
			window.localStorage.songID=$scope.carousels1[index].songId;
			window.open("player.html");
			window.localStorage.playIsOpen="true";
		}
	}
	$scope.allimg2=function(index){
		if(window.localStorage.playIsOpen=="true"){
			if(window.localStorage.songID){
				window.localStorage.removeItem("songID");
			}
			window.localStorage.songID=$scope.carousels2[index].songId;
		}else{
			if(window.localStorage.songID){
				window.localStorage.removeItem("songID");
			}
			window.localStorage.songID=$scope.carousels2[index].songId;
			window.open("player.html");
			window.localStorage.playIsOpen="true";
		}
	}
	$scope.allimg3=function(index){
		if(window.localStorage.playIsOpen=="true"){
			if(window.localStorage.songID){
				window.localStorage.removeItem("songID");
			}
			window.localStorage.songID=$scope.carousels3[index].songId;
		}else{
			if(window.localStorage.songID){
				window.localStorage.removeItem("songID");
			}
			window.localStorage.songID=$scope.carousels3[index].songId;
			window.open("player.html");
			window.localStorage.playIsOpen="true";
		}
	}
});


//旋转木马
CarouselApp.controller('PicCarousel',function($scope,$http){
	$scope.picImg=[];
	$http.get('data/picCarouselimg.json')
		.then(function(response){
			$scope.Data=response.data;
			console.log($scope.Data);
		});
});


//排行榜
CarouselApp.controller('Rook',function($scope,$http){
	$scope.rook1=[];
	$scope.rook2=[];
	$scope.rook3=[];
	$scope.rook4=[];
		$http.get('data/Rook.json')
			.then(function(response){
				$scope.Data=response.data;
				for(var i=0;i<16;++i){
					if(i>=0&&i<=3){
						$scope.rook1.push($scope.Data[i]);
					}else if(i>=4 && i<=7){
						$scope.rook2.push($scope.Data[i]);
					}else if(i>=8 && i<=11){
						$scope.rook3.push($scope.Data[i]);
					}else if(i>=12 && i<=15){
						$scope.rook4.push($scope.Data[i]);
					}
				}
			});
});


//热门歌单
CarouselApp.controller('songMenu',function($scope,$http){
	$scope.carousels1=[];
	$scope.carousels2=[];
	$scope.carousels3=[];
	$http.get('data/SongMenu.json')
		.then(function(response){
			$scope.Data=response.data;
			for(var i=0;i<12;++i){
				if(i>=0&&i<=3){
					$scope.carousels1.push($scope.Data[i]);
				}else if(i>=4 && i<=7){
					$scope.carousels2.push($scope.Data[i]);
				}else{
					$scope.carousels3.push($scope.Data[i]);
				}
				
			}
			
		});
	
	$scope.allimg1=function(index){
		alert($scope.carousels1[index].span1+'\n'+$scope.carousels1[index].span2);
	}
	$scope.allimg2=function(index){
		alert($scope.carousels2[index].span1+'\n'+$scope.carousels2[index].span2);
	}
	$scope.allimg3=function(index){
		alert($scope.carousels3[index].span1+'\n'+$scope.carousels3[index].span2);
	}
	
	
	
	
	var buttons = document.getElementById("songbuttons").getElementsByTagName('span');
	for(var i = 0 ;i<buttons.length;i++){
      		if(i==0){
      			buttons[i].className="songon"
      		}else{
				buttons[i].className='';
			}
	}
	var list = document.getElementById("songMenu_list");
	var container = document.getElementById("songcontainer");
	var prev = document.getElementById("songPrev");
	var next = document.getElementById("songNext");
	var index = 1;
	var animated = false;
	var timer;
	
	function showButton(){
		//先清空按钮的原来的样式
		for(var i = 0 ;i<buttons.length;i++){
			if(buttons[i].className=="songon"){
				buttons[i].className='';
			}
		}
		//将现在选中的按钮加上样式
		buttons[index-1].className="songon";
	}

	//动画
	function animate(offset){//offset是正数说明向向左滑动，点击左边按钮，是负数说明向右滑动，点击了右边按钮
		
		animated = true;//有新的坐标，动画开始
		var newleft = parseInt(list.style.left)+offset;//新坐标
		var time =500;//时间间隔
		var interval=10;//计时器时间
		var speed = offset/(time/interval);//速度，每次计时器跑动的距离
		
		function go(){
			//speed<0 && parseInt(list.style.left)>newleft说明图像向右边滑动
			if(speed<0 && parseInt(list.style.left)>newleft || speed>0 && parseInt(list.style.left)<newleft){//只要左边还不达到新坐标的要求，就一直进行go函数
				list.style.left=parseInt(list.style.left)+speed+'px';//每次移动的左边距离，并赋值新的left值
				
				setTimeout(go,interval);
			}else{
				animated=false;//达到坐标要求，动画结束,不跑了
				list.style.left=newleft+'px';//赋予新值,防止计算过程中约掉的数值产生偏差
					if(newleft>-1200){
						list.style.left=-3600+'px';
					}
					if(newleft<-3600){
						list.style.left=-1200+'px';
					}
			}
		}
		go();//一开始执行的go函数，引进递归函数内
		
	}
	

	next.onclick=function(){
		if(!animated){
			index+=1;
			if(index>3){
				index=1;
			}
			showButton();
			animate(-1200);
		}
	}
	prev.onclick =function(){
		if(!animated){
			index-=1;
			if(index<1){
				index=3;
			}
			showButton();
			animate(1200);
		}
	}
	
	//为按钮添加点击事件
	for(var i=0;i<buttons.length;i++){
		buttons[i].onclick=function(){
			if(this.className=='songon'){//点中的是当前图是，不做任何事情
				return;
			}
			
			if(!animated){//当前动画播放完了之后，执行此次变动
				var myIndex  = parseInt(this.getAttribute('index'));//获得现在按下的按钮的index属性的值
				var offset = -1200*(myIndex-index);//按下按钮的index坐标减去现在轮播到的按钮的坐标；
				index = myIndex;//将改动之后的索引坐标换成现在的坐标
				animate(offset);
				showButton();//通过新得到的坐标改变样式
			}
			
		}
	}
	
});


//MV
CarouselApp.controller('mv',function($scope,$http){
	$scope.mvData;
	$http.get('data/MV/MV.json')
		.then(function(response){
			$scope.mvData=response.data;
		});
		
	$scope.MVAll=function(){
		$http.get('data/MV/MV.json')
		.then(function(response){
			$scope.mvData=response.data;
		});
	}
	
	$scope.MVCN=function(){
		$http.get('data/MV/CN.json')
		.then(function(response){
			$scope.mvData=response.data;
		});
	}
	
	$scope.MVHT=function(){
		$http.get('data/MV/HT.json')
		.then(function(response){
			$scope.mvData=response.data;
		});
	}
	
	$scope.MVEA=function(){
		$http.get('data/MV/EA.json')
		.then(function(response){
			$scope.mvData=response.data;
		});
	}
	
	$scope.MVJP=function(){
		$http.get('data/MV/JP.json')
		.then(function(response){
			$scope.mvData=response.data;
		});
	}
});
