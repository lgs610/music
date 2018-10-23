/**
 * Created by JoJo on 2016/11/17.
 */
window.onbeforeunload=function(){
	localStorage.playIsOpen="false";
}
angular.module('joController',[])
    .controller('playController',function($rootScope,$scope,$http,$timeout){
        //初始化.....
        $scope.$rootScope=$rootScope;
        $scope.$timeout=$timeout;
        $scope.checked=false;
        //请求用户的播放列表
        $http.get('data/songData.json').then(function(response){
            if(response.data.success){
                $scope.songData=response.data.package;
            }
        });
        $scope.playIndex=0;
        $scope.songData=[];
        $scope.source={
            playIndex:$scope.playIndex,
            songList:$scope.songData
        };
        $scope.$watch('songData',function(newVal){
            $scope.source.songList=newVal;
        },true);
        $scope.$watch('source',function(newVal){
        },true);
        //********************两个页面传递ID**********************************


        function MyStorageHandler(e){
            $rootScope.rightNow(e.newValue);
        }
        window.addEventListener('storage',MyStorageHandler,false);
        $(function(){
            console.info('qweqwe');
            if(localStorage.songID){
                $rootScope.rightNow(localStorage.songID);
            }
        })
        $rootScope.rightNow=function(songId){
            $http.get('data/oneSong/song'+songId+'.json').then(function(res){
                if(res.data.success){
                    $scope.source.songList.push(res.data.package);
                    $scope.changeSong($scope.source.songList.length-1);
                }
            })
        }
        //******************************************************

        //检测窗口变化。做出调整
        $(window).resize(function(){
            $scope.$apply($scope.checkSize);
            $scope.adjustLp();
            $scope.adjustBg();
            $scope.adjustSongList();
            $scope.resizeView();
        });
        //检测屏幕尺寸类型
        $scope.checkSize=function (){
            $scope.lgFlag=$('.lgFlag').is(':visible');
            $scope.mdFlag=$('.mdFlag').is(':visible');
            $scope.smFlag=$('.smFlag').is(':visible');
            $scope.xsFlag=$('.xsFlag').is(':visible');
        };
        $scope.checkSize();
        //提示效果
        $scope.showTip=function($event){
            var tipFlag=$('.tipFlag');
            var winHeight=$(window).height();
            tipFlag.css({
                'left':$event.clientX,
                'top':$event.clientY
            });
            tipFlag.addClass('max');
            setTimeout(function(){
                tipFlag.removeClass('max');
                if($scope.xsFlag){
                    tipFlag.animate({
                        'left':'6%',
                        'top':winHeight+'px',
                        'position':'fixed'
                    },500,function(){
                        var btnXsContent=$('.btn-xs-content');
                        btnXsContent.addClass('tipGet tipSetting');
                        setTimeout(function(){
                            btnXsContent.removeClass('tipGet tipSetting');
                        },500);
                    });
                }else{
                    tipFlag.animate({
                        'left':'100%',
                        'top':winHeight+'px',
                        'position':'fixed'
                    },500,function(){
                        var btnSongList=$('.btn-song-list');
                        btnSongList.addClass('tipGet tipSetting');
                        setTimeout(function(){
                            btnSongList.removeClass('tipGet tipSetting');
                        },500);
                    });
                }
            },500)
        }
    })
    .controller('commentController',function($scope,$http){
        //获得评论列表
        $http.get('data/commentList.json').then(function(response){
            if(response.data.success){
                $scope.comment=response.data.package;
            }
        });
        $scope.commentDialog=function(){
            $('.jo-dialog-wrap').show(0,function(){
                $('.jo-dialog-window').addClass('show-dialog');
            });

        };
        $scope.commentDialogHide=function(){
            $('.jo-dialog-window').removeClass('show-dialog');
            setTimeout(function(){
                $('.jo-dialog-wrap').hide();
            },300);
        };
        //$('.jo-dialog-wrap').on('click',function(event){
        //    console.info(1);
        //    event.stopPropagation();
        //    var jdWindow=$('.jo-dialog-window');
        //    jdWindow.addClass('tip-dialog');
        //    setTimeout(function(){
        //        jdWindow.removeClass('tip-dialog');
        //
        //    },300)
        //})

    })
    .controller('playHomeController',function($scope,$http){
        $scope.userSongData='';
        $scope.songMenuCreate='';
        $scope.songMenuCollect='';
        $http.get('data/userSongData.json').then(function(response){
            if(response.data.success){
                $scope.userSongData=response.data.package;
            }
        });
        $scope.$watch('userSongData',function(newVal){
            $scope.songMenuCreate=newVal.songMenuCreate;
            $scope.songMenuCollect=newVal.songMenuCollect;

        },true);

        $scope.toggleSongMenuList=function(songMenu){
            if(songMenu!='collect'&&songMenu!='create'){
                return false;
            }
            var target=songMenu=='collect'?$('.song-menu-collect'):$('.song-menu-create');
            target.slideToggle(200);

            var targetSpan=songMenu=='collect'?$('.collect-title').find('span'):$('.create-title').find('span');
            targetSpan.toggleClass('glyphicon-chevron-right glyphicon-chevron-down');
            $('.play-home-adv-xs').bind('mousewheel', function(event) {
                event.preventDefault();
                var scrollTop = this.scrollTop;
                this.scrollTop = (scrollTop + ((event.deltaY * event.deltaFactor) * -1));
            });
        }
    })
    .controller('songMenuController',function($scope,$stateParams,$http){

        $scope.smId=$stateParams.smId;
        $scope.songMenuData='';
        $scope.songMenuArr=[];
        $http.get('data/songMenu'+$scope.smId+'.json').then(function(response){
            if(response.data.success){
                $scope.songMenuData=response.data.package;
                $scope.songMenuArr=$scope.songMenuData.songMenuArr;
            }
        },function(){
            console.error('404 without this songMenu')
        });
        //添加到播放列表末尾
        $scope.addToList=function(index,$event){
            $scope.showTip($event);
            $scope.source.songList.push($scope.songMenuArr[index]);

        };
        //添加到播放列表末尾，并立即播放
        $scope.instantPlay=function(index,$event){
            $scope.showTip($event);
            if($scope.songMenuArr[index]){
                $scope.source.songList.push($scope.songMenuArr[index]);
                $scope.changeSong($scope.source.songList.length-1);
            }
        };
        //添加所有歌曲至播放列表末尾
        $scope.addAllToList=function(songMenuId,$event){
            $scope.showTip($event);
            $scope.source.songList=$scope.source.songList.concat($scope.songMenuArr||[]);

        };
        //添加所有歌曲至播放列表末尾 并立即播放添加的第一首
        $scope.instantPlayAll=function(songMenuId,$event){
            $scope.showTip($event);
            if($scope.songMenuArr){
                $scope.source.songList=$scope.source.songList.concat($scope.songMenuArr);
                $scope.changeSong($scope.source.songList.length-$scope.songMenuArr.length);
            }
        };
        $('.play-home-right-bottom').bind('mousewheel', function(event) {
            event.preventDefault();
            var scrollTop = this.scrollTop;
            this.scrollTop = (scrollTop + ((event.deltaY * event.deltaFactor) * -1));
        });
    })
    .controller('albumContentController',function($scope,$stateParams,$http){
        $http.get('data/album'+'0011'+'.json').then(function(response){
            if(response.data.success){
                $scope.album=response.data.package;
                $scope.albumSongArr=$scope.album.albumSongArr;
            }
        });
    })
    .controller('advController',function($scope,$stateParams,$http,$rootScope){
        $rootScope.advSongMenuArr=[];
        $http.get('data/advSongMenu.json').then(function(response){
            if(response.data.success){
                $rootScope.advSongMenuArr=response.data.package;

            }
        });
        $('.adv-page').bind('mousewheel', function(event) {
            event.preventDefault();
            var scrollTop = this.scrollTop;
            this.scrollTop = (scrollTop + ((event.deltaY * event.deltaFactor) * -1));
        });
    });


