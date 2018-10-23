
MyMusicApp.controller('Controller_rook17',function($scope,$http){
	$scope.Data;//所有的数据，可变化
	$scope.DataCount;//总数据数
	$scope.pageCount;//有多少页
	$scope.nowPage;//当前页面
	$scope.setting={
		'width':50,
		'marginInterval':2,//按钮之间的间隔
		'pageRowCount':10,//规定一页有多少行
		'pageArrNumber':7//多少个按钮
	}
	$scope.onePageData=[];//每页的数据存放
	$scope.pageCountArr=[];//按钮上所显示的文本
	

    
	//人工配置函数
	$scope.getSetting=function(){
			//获取对象
			var setting = $(".paging").attr("data-setting");
			//判断手动设置的参数配置是否存在
			if(setting && setting!=""){
				return $.parseJSON(setting);//转化为JSON格式的数据
			}else{
				return {};//否则返回空对象
			}
	}
	
	//人工参数替换默认参数
	$.extend($scope.setting,$scope.getSetting());

	
		$http.get("data/Rank/rank17.json")
			.then(function(response){
				
				
				$scope.Data=response.data;//接受传入数据
				
				$scope.DataCount=$scope.Data.length;//总数据数
				$scope.pageCount = Math.ceil($scope.DataCount/$scope.setting.pageRowCount);//计算总页数
				if($scope.pageCount<$scope.setting.pageArrNumber){//总页数小于按钮个数时，将按钮个数调整为页数
					$scope.setting.pageArrNumber=$scope.pageCount;
				}
				//把页数转成数组，方便输出
				$scope.pageInitBtnSheet($scope.pageCount);//把页数插入pageInitBtnSheet函数，判断样式，按钮的个数等
				
				//当前页面数据
				for(var i=0;i<$scope.setting.pageRowCount;i++){//第一次打开页面时加载数据（第一页的内容）
					$scope.onePageData.push($scope.Data[i]);
				}
				//console.log($scope.getSetting());
				console.log($scope.setting);
			});
			

	
	//按钮事件
	$scope.pageBtn=function(e){
		var index=e.target.getAttribute('data-index');//点击的是第几个按钮，从0开始算
		var iptVal=$('.paging_ipt').val();//input里面的值
		var page=e.target.innerText;//当前点击的按钮的页码数
		
		//显示数据
		if(!(e.target.innerText=="...")){//点击的不是...按钮，就换数据
			console.log(e.target.style.background);//——————————————————————————
			if(e.target.innerText!=iptVal){//点击的按钮背景色不是蓝色，说明点的不是当前数据页面的按钮
				
				//样式改变
				$(".paging_Btn").css({//样式清空
					background:'#000000'
				});
				$(".paging_Btn").eq(index).css({background:'#1697CB'});//点击后的按钮，背景色改变
				
				
				//数据改变
				$scope.dataChange(page);
				
				
			}
			
			
		}else{//点击的是...按钮，换按钮样式
			
			$(".paging_Btn").css({//样式清空
					background:'#000000'
			});
			//前面的...按钮
			if(e.target.getAttribute('data-index')==0){
				var temp=$scope.pageCountArr[1];//...后面的按钮的页码
				if(temp-($scope.setting.pageArrNumber-1)>0){//没有达到开头页码
					for(var i=$scope.setting.pageArrNumber-1;i>=0;--i){
						if(i==0){
							$scope.pageCountArr[i]='...';
						}else if(i==$scope.setting.pageArrNumber-1){
							$scope.pageCountArr[i]='...';
						}else{
							$scope.pageCountArr[i]=temp--;
						}
					}
				}else{
					temp=1;
					for(var i=0;i<$scope.setting.pageArrNumber;++i){
						if(i==$scope.setting.pageArrNumber-1){
							$scope.pageCountArr[i]='...';
						}else{
							$scope.pageCountArr[i]=temp++;
						}
					}
				}
			}
			//后面的...按钮
			else{
				var temp=$scope.pageCountArr[$scope.setting.pageArrNumber-2];//...前面按钮的页码
				if(temp+($scope.setting.pageArrNumber-1)<$scope.pageCount){//...前面按钮的页码加上按钮数量除去第一个...按钮的页码的数字小于总页数
					for(var i=0;i<$scope.setting.pageArrNumber;++i){
						if(i==0){
							$scope.pageCountArr[i]='...';
						}else if(i==$scope.setting.pageArrNumber-1){
							$scope.pageCountArr[i]='...';
						}else{
							$scope.pageCountArr[i]=temp++;
						}
					}
				}else{//点击完...按钮之后达到最大页数
					temp=$scope.pageCount;
					for(var i=$scope.setting.pageArrNumber-1;i>=0;--i){
						if(i==0){
							$scope.pageCountArr[i]='...';
						}else{
							$scope.pageCountArr[i]=temp--;
						}
					}
				}
			}
		}
		//样式改变
		for(var i=0;i<$scope.setting.pageArrNumber;++i){
			if($scope.pageCountArr[i]==$(".paging_ipt").val()){
				$(".paging_Btn").eq(i).css({background:'#1697CB'});
			}
		}
	}
	
	
	//样式改变
	
	
	
	
	//首页
	$scope.page_Frist=function(){
		if(1!=parseInt($('.paging_ipt').val())){
			$scope.dataChange(1);//数据改变
			
			$scope.numberChange(1);//样式改变
			
		}else{
			alert("已经是首页了");
		}
	}
	//末页
	$scope.page_End=function(){
		if($scope.pageCount!=parseInt($('.paging_ipt').val())){
			$scope.dataChange($scope.pageCount);//数据改变
			
			$scope.numberChange($scope.pageCount);//样式改变
			
		}else{
			alert("已经是末页了");
		}
	}
	//上一页
	$scope.pageprev=function(){
		var page = parseInt($('.paging_ipt').val())-1;//下一个页面
		if(page>=1){
			var temp=page;
			$scope.dataChange(page);//数据改变
			
			$scope.numberChange(page);//样式改变
			
		}else{
			alert("已经是第一页了");
		}
	}
	//下一页
	$scope.pagenext=function(){
		var page = parseInt($('.paging_ipt').val())+1;//下一个页面
		if(page<=$scope.pageCount){
			var temp=page;
			$scope.dataChange(page);//数据改变
			
			$scope.numberChange(page);//样式改变
			
		}else{
			alert("已经是最后一页了");
		}
	}
	//跳转
	$scope.pageGo=function(){
		var page = parseInt($('.paging_ipt').val());
		console.log(page);
		if(page>0 && page<=$scope.pageCount && $scope.nowPage!=parseInt($('.paging_ipt').val())){
			$scope.dataChange(page);//数据改变
			
			$scope.numberChange(page);//样式改变
			
		}else if($scope.nowPage==page){
			alert("已在此页");
		}else if(page<=0){
			alert("页码不低于0");
			$('.paging_ipt').val($scope.nowPage);
		}else if(page>$scope.pageCount){
			alert("页码超出最大数");
			$('.paging_ipt').val($scope.nowPage);
		}else{
			alert("页码格式不正确");
			$('.paging_ipt').val($scope.nowPage);
		}
	}
	
	//样式数据变化函数
	$scope.numberChange=function(page){
			var temp=1;
			var tem=$scope.pageCount;//最后一页
			var lt=page;
			var gt=page;
			//是否跳转到第一页
			if(page<=$scope.setting.pageArrNumber && $scope.setting.pageArrNumber<=6){//按钮数少的情况
				for(var i=0;i<$scope.setting.pageArrNumber;++i){
					$scope.pageCountArr[i]=temp++;
				}
			}else if(page<=$scope.setting.pageArrNumber-1 && $scope.setting.pageArrNumber>6){//按钮数过多有...的情况
				for(var i=0;i<$scope.setting.pageArrNumber;++i){
					if(i==$scope.setting.pageArrNumber-1){
							$scope.pageCountArr[i]='...';
					}else{
						$scope.pageCountArr[i]=temp++;
					}
				}
			}
			//是否跳转到最后一页
			else if(page>$scope.pageCount-$scope.setting.pageArrNumber && $scope.setting.pageArrNumber<=6){//按钮数少的情况
				for(var i=$scope.setting.pageArrNumber-1;i>=0;--i){
					$scope.pageCountArr[i]=tem--;
				}
			}else if(page>$scope.pageCount-$scope.setting.pageArrNumber+1 && $scope.setting.pageArrNumber>6){//按钮数过多有...的情况
				for(var i=$scope.setting.pageArrNumber-1;i>=0;--i){
					if(i==0){
						$scope.pageCountArr[i]='...';
					}else{
						$scope.pageCountArr[i]=tem--;
					}
				}
			}
			//剩下的情况
			else if($scope.setting.pageArrNumber<=6){//无...的情况
				var t=Math.floor($scope.setting.pageArrNumber/2);//向上取整的页数
				for(var i=t;i>=0;--i){
					$scope.pageCountArr[i]=lt--;
				}
				for(var i=t;i<$scope.setting.pageArrNumber;++i){
					$scope.pageCountArr[i]=gt++;
				}
			}else{
				var t=Math.floor($scope.setting.pageArrNumber/2);//向上取整的页数
				for(var i=t;i>=0;--i){
					if(i==0){
						$scope.pageCountArr[i]='...';
					}else{
						$scope.pageCountArr[i]=lt--;
					}
				}
				for(var i=t;i<$scope.setting.pageArrNumber;++i){
					if(i==$scope.setting.pageArrNumber-1){
						$scope.pageCountArr[i]='...';
					}else{
						$scope.pageCountArr[i]=gt++;
					}
				}
			}
			$scope.styleChange();//样式改变
	}
	
	//鼠标移入事件
	$scope.pageBtnOver=function(e){//鼠标移入页码按钮时，改变背景色
		$(".paging_Btn").eq(e.target.getAttribute('data-index')).css({background:'#1697CB'});
	}
	//鼠标移出事件
	$scope.pageBtnLeave=function(e){
		if(e.target.innerText!=$('.paging_ipt').val()){//如果是和input文本框不一样页码的按钮，才改变背景样式
			$(".paging_Btn").eq(e.target.getAttribute('data-index')).css({background:'#000000'});
		}
	}
	
	//样式改变函数
	$scope.styleChange=function(){
		//样式改变
			$(".paging_Btn").css({//样式清空
				background:'#000000'
			});
			for(var i=0;i<$scope.setting.pageArrNumber;++i){
				if($scope.pageCountArr[i]==$(".paging_ipt").val()){
					$(".paging_Btn").eq(i).css({background:'#1697CB'});
				}
			}	
	}
	
	//数据改变函数
	$scope.dataChange=function(page){
		$scope.onePageData.length=0;//清空当前页的数据
				//点击的页码所对应的数据页
				for(var i=(page-1)*$scope.setting.pageRowCount;i<page*$scope.setting.pageRowCount;++i){
					if(i<$scope.DataCount){//i是否小于总的数据行数
						$scope.onePageData.push($scope.Data[i]);
					}else{
						break;//超出数据行数则直接退出循环
					}
				}
		$scope.nowPage=page;
		$('.paging_ipt').val(page);//设置input的值
	}
	
	
	//分页按钮样式，初始配置
	$scope.pageInitBtnSheet=function(pageCount){
		//总页数少于等于按钮数
		if(pageCount<=$scope.setting.pageArrNumber){
			$('.paging_ul').css({//为了居中显示而计算的UL的宽度
				width:($scope.setting.width+$scope.setting.marginInterval*2)*(pageCount+6)
			});
			for(var i=0;i<$scope.pageCount;i++){//按钮显示的文本从1开始加到最大页数，有多少页就多少个按钮
				$scope.pageCountArr.push(i+1);
			}
		}
		//总页数大于按钮数，不过设置的按钮数小于等于6个，不出现“...”按钮
		else if(pageCount>$scope.setting.pageArrNumber && $scope.setting.pageArrNumber<=6){
			$('.paging_ul').css({
				width:($scope.setting.width+$scope.setting.marginInterval*2)*($scope.setting.pageArrNumber+6)
			});
			for(var i=0;i<$scope.setting.pageArrNumber;i++){
				$scope.pageCountArr.push(i+1);
			}
		}
		//总页数大于按钮数
		else{
			$('.paging_ul').css({
				width:($scope.setting.width+$scope.setting.marginInterval*2)*($scope.setting.pageArrNumber+6)
			});
			for(var i=0;i<$scope.setting.pageArrNumber-1;i++){
				$scope.pageCountArr.push(i+1);
			}
			$scope.pageCountArr.push("...");
		}
		$scope.nowPage=1;//当前页是第一页
		$(".paging_Btn").first().css({background:'#1697CB'});
		$('.paging_ipt').val(1);//设置初始input的值
	}
	
});

