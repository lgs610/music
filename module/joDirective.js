/**
 * Created by JoJo on 2016/11/17.
 */
angular.module('joDirective',['joController'])
    .directive('header',function(){
        return {
            templateUrl:'template/header.html',
            replace:true,
            restrict:'E'
        }
    })
    .directive('contentLeft',function(){
        return {
            templateUrl:'template/contentLeft.html',
            replace:true,
            restrict:'E',
            link:function(scope){
                //黑胶光盘适应调整
                scope.adjustLp=function(){
                    var lpCon=$('.lp-container');
                    lpCon.height(lpCon.width());
                    var lpItem=$('.lp-item');
                    lpItem.attr('style','');
                    //用jq.height()会获得旋转导致变化的值.所以改用原生
                    lpItem.height(lpItem[0].offsetWidth);
                };
                //背景图片调整
                scope.adjustBg=function (){
                    var content=$('.content');
                    var conHeight=content[0].offsetHeight;
                    var conWidth=content[0].offsetWidth;
                    var bg=$('.play-bg');
                    bg.attr('style','');
                    var targetVal='';
                    if(conHeight>conWidth){
                        bg.height(1.7*conHeight);
                        targetVal=-(1.7*conHeight-conWidth)*0.5+'px';
                        bg.css({
                            'position':'absolute',
                            'margin-left':targetVal,
                            'top':'-35%',
                            'left':'0'
                        });
                    }else if(conHeight<conWidth){
                        bg.width(1.7*conWidth);
                        targetVal=-(1.7*conWidth-conHeight)*0.5+'px';
                        bg.css({
                            'position':'absolute',
                            'margin-top':targetVal,
                            'left':'-35%',
                            'top':'0'
                        })
                    }else{
                        bg.width(1.2*conWidth);
                        bg.css({
                            'position':'absolute',
                            'left':'-10%',
                            'top':'-10%'
                        })
                    }

                };

                //黑胶切换效果
                scope.changeLp=function(imgSrc,type){
                    if(type!='next'&&type!='last'){
                        return false;
                    }
                    var str='<div>'+
                        '<img/>'+
                        '</div>'
                    var newItem=$(str);
                    newItem.addClass('lp-item');
                    var target=$('.rotate');
                    $('img',newItem).attr('src',imgSrc);
                    if(type=='next'){
                        target.css({
                            'left':'70%',
                            'opacity':'0'
                        });
                        newItem.insertBefore(target);
                        newItem.height(newItem.width());
                        newItem.animate({
                            'left':'-30%',
                            'opacity':'0'
                        },500,function(){
                            newItem.remove();
                        });
                        target.animate({
                            'left':'20%',
                            'opacity':'1'
                        },500);
                    }else{
                        target.css({
                            'left':'-30%',
                            'opacity':'0'
                        });
                        var con=$('.lp-container');
                        con.append(newItem);
                        newItem.height(newItem.width());
                        newItem.css({
                            'left':'20%',
                            'opacity':'1'
                        });
                        newItem.animate({
                            'left':'70%',
                            'opacity':'0'
                        },500,function(){
                            newItem.remove();
                        });
                        target.animate({
                            'left':'20%',
                            'opacity':'1'
                        },500);
                    }

                };
                scope.adjustLp();
                scope.adjustBg();
            }
        }
    })
    .directive('contentRight',function(){
        return {
            templateUrl:'template/contentRight.html',
            replace:true,
            restrict:'E',
            link:function(scope){
                scope.contentOpenFlag=true;
                var content=$('.content');
                //最小化播放窗口
                scope.reduce=function(flag){
                    scope.contentOpenFlag=false;
                    content.addClass('oHide reduce');
                    setTimeout(function(){
                        if(!flag){
                            $('.min-content').fadeIn(500);
                        }
                    },500);
                    $('.play-bar').addClass('hidden-xs');
                    $('.header').addClass('hidden-xs');

                };
                //响应式内容和歌词切换 仅在XS状态下才允许使用.
                scope.resContentChange=function(){
                    var conLeft=$('.content-left');
                    var conRight=$('.content-right');
                    if(conLeft.is(':hidden')){
                        conRight.fadeOut(250,function(){
                            conRight.addClass('hidden-xs');
                            conRight.attr('style','');
                            conLeft.removeClass('hidden-xs');
                            conLeft.fadeIn(250);
                            scope.adjustLp();
                        });
                    }else if(conRight.is(':hidden')){
                        conLeft.fadeOut(250,function(){
                            conRight.removeClass('hidden-xs');
                            conRight.hide();
                            conRight.fadeIn(250);
                            conLeft.addClass('hidden-xs');
                            conLeft.attr('style','');
                        });
                    }
                }
            }
        }
    })
    .directive('playBar',function(){
        return {
            templateUrl:'template/playBar.html',
            replace:true,
            restrict:'E',
            link:function(scope, iElem, iAttr, ctrl){
                //初始化joAudio的配置
                var btnPlay=$('.btn-play');
                var setting={
                    progress:{
                        slideBar:$('.currentTimeBar'),
                        slideBlock:$('.currentTimeBlock'),
                        slided:$('.currentTimeSlided')
                    },
                    button:{
                        switch:btnPlay
                    },
                    time:{
                        currentTime:$('.currentTime'),
                        duration:$('.duration')
                    },
                    volume:{
                        slideBar:$('.volumeBar'),
                        slideBlock:$('.volumeBlock'),
                        slided:$('.volumeSlided')
                    }
                };
                //使用joAudio插件 并设计播放源对象
                var audio=$('audio').joAudio(setting);
                audio.setSource(scope.source);
                scope.audio=audio;
                //播放模式切换
                audio.element.onended=function(){
                    switch(scope.playModel){
                        case 1:scope.$apply(audio.singePlayEvent.bind(audio));break;
                        case 2:scope.$apply(audio.listPlayEvent.bind(audio));break;
                        case 3:scope.$apply(audio.randomPlayEvent.bind(audio));break;
                        case 4:scope.$apply(audio.singeLoopPlayEvent.bind(audio));break;
                        case 5:scope.$apply(audio.listLoopPlayEvent.bind(audio));break;
                        default :break;
                    }
                };
                //点中播放歌曲切换
                scope.changeSong=function(index){
                    audio.changeSong(index);
                };
                //清空播放列表
                scope.clearSongList=function(){
                    audio.clearSongList();
                    scope.reduce(true);
                    $('.min-content').fadeOut();

                    check();
                };
                //检测歌曲加入
                var checkTimer;
                function check(){
                    checkTimer=setInterval(function(){
                        if(scope.source.songList.length){
                            $('.min-content').fadeIn();
                            clearInterval(checkTimer);
                        }
                    },50);
                }
                //播放列表
                scope.showListFlag=false;
                scope.showList=function(){
                    scope.showListFlag=!scope.showListFlag;
                    scope.adjustSongList();
                    $('.btn-song-list span').toggleClass('jo-btn-active');
                };
                //响应式播放列表尺寸...
                scope.adjustSongList=function(){
                    var slCon=$('.song-list-container');
                    var slTable=$('.song-list');
                    if(scope.smFlag||scope.xsFlag){
                        slCon.width($(window).width());
                    }else{
                        slCon.attr('style','');
                    }
                };
                //播放列表滚动事件
                $('.song-list-view').bind('mousewheel', function(event) {
                    event.preventDefault();
                    var scrollTop = this.scrollTop;
                    this.scrollTop = (scrollTop + ((event.deltaY * event.deltaFactor) * -1));
               
                });
                //播放模式切换....
                scope.playModel=audio.playModel;
                scope.playModelMessage=['单曲播放','列表播放','随机播放','单曲循环','列表循环'];
                scope.changePlayModel=function(){
                    scope.playModel>=5?scope.playModel=1:scope.playModel++;
                    audio.playModel=scope.playModel;
                };
                //静音
                scope.muted=function(){
                    audio.mutedSwitch();
                    var btnVolumeSpan=$('.btnVolume span');
                    btnVolumeSpan.toggleClass('glyphicon-volume-up glyphicon-volume-off jo-btn-active');
                };
                //上一首下一首选择
                $('.btn-next').on('click',function(){
                    next();
                });

                $('.btn-last').on('click',function(){
                    last();
                });
                function next(){
                    var imgSrc=scope.source.songList[scope.source.playIndex].albumCoverUrl;
                    audio.nextEvent.bind(audio)();
                    scope.changeLp(imgSrc,'next');
                }
                function last(){
                    var imgSrc=scope.source.songList[scope.source.playIndex].albumCoverUrl;
                    scope.$apply(audio.lastEvent.bind(audio));
                    scope.changeLp(imgSrc,'last');
                }
                //检测播放状态设置按钮状态
                setInterval(function(){
                    if(audio.element.paused){
                        $('span',btnPlay).addClass('glyphicon-play');
                        $('span',btnPlay).removeClass('glyphicon-pause');
                        $('.rotate').removeClass('rotateRun');
                    }else{
                        $('span',btnPlay).removeClass('glyphicon-play');
                        $('span',btnPlay).addClass('glyphicon-pause');
                        $('.rotate').addClass('rotateRun');
                    }
                },100);
                scope.commentFlag=false;
                //评论与播放视图上下切换
                scope.changeView=function(){
                    if(scope.commentFlag){
                        scope.changeToContent();
                    }else{
                        scope.changeToComment();
                    }
                    scope.commentFlag=!scope.commentFlag;

                };
                //自适应调整视图位置
                scope.resizeView=function (){
                    var wrap=$('.wrap');
                    if(scope.commentFlag){
                        var wrapHeight=wrap.height();
                        wrap.css({
                            "top":(-wrapHeight)*0.5+60+'px'
                        });
                    }else{
                        wrap.css({
                            "top":0+'px'
                        });
                    }
                };
                //改变视图到内容
                scope.changeToContent=function (){
                    var wrap=$('.wrap');
                    wrap.animate({
                        "top":0+'px'
                    },300,'linear',function(){
                        $('.btn-change span').toggleClass("jo-btn-active shine");
                        $('.comment').hide();
                    });
                };
                //改变视图到评论
                scope.changeToComment=function (noAnimate){
                    var wrap=$('.wrap');
                    var wrapHeight=wrap.height();
                    wrap.animate({
                        "top":(-wrapHeight)*0.5+60+'px'
                    },300,'linear',function(){
                        $('.btn-change span').toggleClass("jo-btn-active shine");
                    });
                    $('.comment').show();
                };
                //键盘切歌
                $(window).on('keydown',function(event){
                    if(!$('.play-bar').is(':hidden')){
                        if(event.key=='ArrowRight'){
                            next();
                        }else if(event.key=='ArrowLeft'){
                            last();
                        }
                    }
                });

            }
        }
    })
    .directive('comment',function(){
        return {
            templateUrl:'template/comment.html',
            replace:true,
            restrict:'E',
            controller:'commentController'
        }
    })
    .directive('playHome',function(){
        return {
            templateUrl:'template/playHome.html',
            replace:true,
            restrict:'E',
            link:function(scope){
                scope.$rootScope.playHomeHolder=$('.play-home-right-holder');

                //play home left 菜单活动状态切换
                scope.itemOpenIndex=-1;
                scope.itemActive=function(songMenuIndex,index){
                    scope.itemOpenIndex=songMenuIndex+index;
                    scope.xsSongMenu();
                };
                //play home left 滚轮事件
                $('.play-home-left-top').bind('mousewheel', function(event) {
                    event.preventDefault();
                    var scrollTop = this.scrollTop;
                    this.scrollTop = (scrollTop + ((event.deltaY * event.deltaFactor) * -1));
                });
                $('.play-home-left-xs').bind('mousewheel', function(event) {
                    event.preventDefault();
                    var scrollTop = this.scrollTop;
                    this.scrollTop = (scrollTop + ((event.deltaY * event.deltaFactor) * -1));
                });
                //xs大小下显示歌单
                scope.xsSongMenu=function(){
                    if(scope.xsFlag){
                        $('.play-home-right').animate({
                            'left':'0'
                        },700,function(){
                            scope.playHomeRightFlag=true;
                        });
                    }
                };
                //xs下隐藏歌单
                scope.xsSongMenuHide=function(){
                    if(scope.xsFlag){
                        var playHomeRight=$('.play-home-right');
                        playHomeRight.animate({
                            'left':'100%'
                        },700,function(){
                            scope.playHomeRightFlag=true;
                            playHomeRight.attr('style','');
                        });
                    }
                };
                //最大化播放内容
                scope.maxContent=function(){
                    $('.content').removeClass('reduce oHide');
                    var playHomeFooter=$('.play-home-footer');
                    if(!playHomeFooter.is(':hidden')){
                        scope.contentOpenFlag=true;
                    }
                    else{
                        if(scope.smFlag){
                            scope.contentOpenFlag=true;
                        }
                        $('.min-content').fadeOut(1000, function () {
                            scope.$apply(function(){
                                scope.contentOpenFlag=true;
                            });
                        });
                    }
                    $('.play-bar').removeClass('hidden-xs');
                    $('.header').removeClass('hidden-xs');

                };
            }
        }
    })
    .directive('playHomeHeader',function(){
        return {
            templateUrl:'template/playHomeHeader.html',
            replace:true,
            restrict:'E',
            link:function(scope){

            }
        }
    })
    .directive('playHomeFooter',function(){
        return {
            templateUrl:'template/playHomeFooter.html',
            replace:true,
            restrict:'E',
            link:function(scope){
                scope.$rootScope.xsPageFlag={
                    songMenu:false,
                    adv:true,
                    user:false,
                    friend:false

                };
                scope.$rootScope.xsPageChange=function(page){
                    for(x in scope.$rootScope.xsPageFlag){
                        scope.$rootScope.xsPageFlag[x]=false;
                    }
                    scope.xsSongMenuHide();
                    scope.$rootScope.xsPageFlag[page]=true;
                };
                scope.$watch('xsPageFlag',function(newVal){
                },true)
            }
        }
    })
    .directive('advPage',function(){
        return {
            templateUrl:'template/advPage.html',
            replace:true,
            restrict:'E',
            controller:'advController'
        }
    })
    .directive('userPage',function(){
        return {
            replace:true,
            strict:'E',
            templateUrl:'template/userPage.html',
            link:function(){
                $('.user-opera').bind('mousewheel', function(event) {
                    event.preventDefault();
                    var scrollTop = this.scrollTop;
                    this.scrollTop = (scrollTop + ((event.deltaY * event.deltaFactor) * -1));
                });
            }
        }
    });
