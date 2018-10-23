;(function($){
	//定义旋转木马类
	var Carousel = function(poster){
		var _self = this;//当按钮点击事件触发，要获得的是Carousel的carouselRotate()函数，防止this跳转冲突
		
		//保存单个旋转木马对象
		this.poster = poster;
		this.posterItemMain = poster.find("ul.poster-list");//通过对象找到ul
		this.nextBtn = poster.find("div.poster-next-btn");//通过对象找到按钮
		this.prevBtn = poster.find("div.poster-prev-btn");
		//幻灯片的数量
		this.posterItems = poster.find("li.poster-item");
		//第一张图
		this.posterFirstItem = this.posterItems.first();
		//最后一张
		this.posterLastItem = this.posterItems.last();
		//旋转标志
		this.RotateFlag = true;//可以旋转
		//默认配置参数
		this.setting={
			"width":1200,
			"height":432,
			"posterWidth":1080,
			"posterHeight":432,
			"scale":0.9,
			"speed":500,
			"autoPlay":false,
			"delay":3000,
			"verticalAlign":"middle"
		}
		//对于人工配置的参数有就替换和追加，替换原来的参数，和追加新的参数，返回空对象时，追加空的参数和原来没变化
		$.extend(this.setting,this.getSetting());
		//执行配置好参数之后调整的数值
		this.setSettingValue();
		this.setPosterPos();
		this.nextBtn.click(function(){
			if(_self.RotateFlag==true){
				_self.RotateFlag=false;
				_self.carouselRotate("next");
			}
		});
		this.prevBtn.click(function(){
			if(_self.RotateFlag==true){
				_self.RotateFlag=false;
				_self.carouselRotate("prev");
			}
		});
		this.setPosterClick();
		//是否开启自动播放
		if(this.setting.autoPlay==true){
			this.autoPlay();
			this.poster.hover(function(){
				window.clearInterval(_self.timer);
			},function(){
				_self.autoPlay();
			});
		}
		
		
	};
	
	//定义旋转木马类的属性
	Carousel.prototype={
		//自动播放函数
		autoPlay:function(){
			var self_ = this;
			this.timer=window.setInterval(function(){
				self_.nextBtn.click();
			},this.setting.delay);
		},
		//旋转函数
		carouselRotate:function(dir){
			var _this_ = this;//防止旋转时each()函数使用this冲突，此this指向Carousel对象
			var zIndexArr=[];
			if(dir=="next"){
				this.posterItems.each(function(){
					var self = $(this),
						next = self.next().get(0)?self.next():_this_.posterFirstItem,//判断点击左移的时候，在DOM中是否存在上一个节点，没有则取DOM中的之后一个节点元素
						zIndex = next.css("zIndex"),
						width = next.width(),
						height = next.height(),
						opacity = next.css("opacity"),
						left = next.css("left"),
						top = next.css("top");
						zIndexArr.push(zIndex);
						self.animate({
							width:width,
							height:height,
							opacity:opacity,
							left:left,
							top:top
						},_this_.setting.speed,function(){
							_this_.RotateFlag=true;
						});
				});
				this.posterItems.each(function(i){
					$(this).css("zIndex",zIndexArr[i]);
				});
			}else{
				this.posterItems.each(function(){
					var self = $(this),
						prev = self.prev().get(0)?self.prev():_this_.posterLastItem,//判断点击左移的时候，在DOM中是否存在上一个节点，没有则取DOM中的之后一个节点元素
						zIndex = prev.css("zIndex"),
						width = prev.width(),
						height = prev.height(),
						opacity = prev.css("opacity"),
						left = prev.css("left"),
						top = prev.css("top");
						zIndexArr.push(zIndex);
						self.animate({
							zIndex:zIndex,
							width:width,
							height:height,
							opacity:opacity,
							left:left,
							top:top
						},_this_.setting.speed,function(){
							_this_.RotateFlag=true;
						});
				});
				this.posterItems.each(function(i){
					$(this).css("zIndex",zIndexArr[i]);
				});
			}
		},
		
		
		//为每一个幻灯片添加点击事件
		setPosterClick:function(){
			var _this_ = this;
			this.posterItems.each(function(){
				var self=$(this);
				self.click(function(e){
					e.preventDefault();
					if(self.css('zIndex')==Math.floor(_this_.posterItems.length/2)){
						window.open(self.find("a").attr('href'),"_self");
					}
				});
			});
		},
		
		
		//设置剩余帧数的位置关系
		setPosterPos:function(){
			var self = this;//当前旋转木马自身，在each遍历中使用this,会冲突，先申明一个self指向当前Carousel对象
			var sliceItems = this.posterItems.slice(1),//获取除了第一张图之外剩下的图所在的li对象
				sliceSize  = sliceItems.length/2,//分散在每一边的图片个数
				rightSlice = sliceItems.slice(0,sliceSize),//分散在右边的li对象
				leftSlice=sliceItems.slice(sliceSize),
				level      = Math.floor(this.posterItems.length/2);//层级数，z-index，结果对应第一张图的z-index
			//设置右边帧的位置关系和宽度和高度等信息
			var rw = this.setting.posterWidth,//第一张图的宽度
				rh = this.setting.posterHeight,//第一张图的高度
				gap= ((this.setting.width-this.setting.posterWidth)/2)/level;//每张图片之间的间隙
			
			//第一张图的右边框所对应的left位置
			var fixOffsetLeft = (this.setting.width-rw)/2+rw;
			
			rightSlice.each(function(i){//循环遍历每一张图并设置配置信息
				level--;
				rw = rw*self.setting.scale;//每次循环按照比例缩小宽度
				rh = rh*self.setting.scale;//每次循环按照比例缩小高度
				
				//配置信息
				$(this).css({
					zIndex:level,
					width:rw,
					height:rh,
					opacity:1/(++i),//i的值是从0开始，对应层级数高的，i的值越高，层级数越低，那么1/(i)之后得到的透明度值就越低
					left:fixOffsetLeft+(i)*gap-rw,//i的值加1可以得出要加上多少个间隔的距离，再减去自身图的宽度，可以得到当前图的left值
					top:self.setVertucalAlign(rh)
				});
			});
			
			var lw = rightSlice.last().width(),
				lh = rightSlice.last().height(),
				oloop=Math.floor(this.posterItems.length/2);
			leftSlice.each(function(i){
				
				
				
				$(this).css({
					zIndex:level,
					width:lw,
					height:lh,
					opacity:1/oloop,
					left:i*gap,
					top:self.setVertucalAlign(lh)
				});
				lw = lw/self.setting.scale;
				lh = lh/self.setting.scale;
				oloop--;
				level++;
			});
			
		},
		
		//设置垂直排列对齐方式
		setVertucalAlign:function(h){
			if(this.setting.verticalAlign=='top'){
				return 0;
			}else if(this.setting.verticalAlign=='bottom'){
				return this.setting.height-h;
			}else{
				return (this.setting.height-h)/2;
			}
		},
		
		//设置配置参数值去控制基本的高度和宽度
		setSettingValue:function(){
//			this.poster.css({
//				width:this.setting.width,
//				height:this.setting.height
//			});
			this.posterItemMain.css({
				width:this.setting.width,
				height:this.setting.height
			});
			//计算上下切换按钮的Css数据
			var w = (this.setting.width-this.setting.posterWidth)/2;
			
			this.prevBtn.css({
//				width:50,
//				height:this.setting.height*0.3,
//				lineHeight:this.setting.height*0.3+'px',
				zIndex:Math.ceil(this.posterItems.length/2)
			});
			this.nextBtn.css({
//				width:50,
//				height:this.setting.height*0.3,
//				lineHeight:this.setting.height*0.3+'px',
				zIndex:Math.ceil(this.posterItems.length/2)
			});
			
			//第一张图的位置
			this.posterFirstItem.css({
				width:this.setting.posterWidth,
				height:this.setting.posterHeight,
				left:w,
				zIndex:Math.floor(this.posterItems.length/2)
			});
		},
		
		
		//获取人工配置参数
		getSetting:function(){
			//获取对象
			var setting = this.poster.attr("data-setting");
			//判断手动设置的参数配置是否存在
			if(setting && setting!=""){
				return $.parseJSON(setting);//转化为JSON格式的数据
			}else{
				return {};//否则返回空对象
			}
		}
	};
	
	//旋转木马的初始化
	Carousel.init = function(posters){
		//_this等于this，等于Carousel这个对象
		var _this = this;
		
		posters.each(function(){
			/*_this表示当前Carousel方法对象，用这个方法对象实例化posters的每一个传入的对象
			 * 由于posters是一个数组，所以用each方法之后可以获得数组中的当前数组元素，此时的this
			 * 指的是posters中的当前值，即$(this)，而_this()指的是Carousel这个方法，所以
			 * new _this($(this));实际上是 new Carousel(posters[index]);为每一个旋转木马都初始化
			 */
			new _this($(this));
		});
	}
	
	//window['Carousel']等价于window.Carousel，相当于给window添加了一个属性，那么在window下就可以访问到Carousel这个属性了
	window['Carousel'] = Carousel;
	
})(jQuery);
