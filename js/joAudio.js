/**
 * Created by JoJo on 2016/11/10.
 */

;(function($){
    // 1.�������� 2���б��� 3��������� 4������ѭ�� 5���б�ѭ��
    //{playIndex:num,songList:arr}
    //playIndexΪ��ǰ��Ҫ���ŵĸ��������� songListΪ��Ҫ���ŵĸ����б�
    //����audioΪ��������ģʽ �����굱ǰ���� �Զ��ݶ�
    //songList��������
    /*
    songList=[{
        songName:string,
        songSrc:string,
        artist:string,
        albumId:number,
        coverSrc:string
        songId:number
        ......
    }]

     */

    //��ղ���Դ�����ڵĲ����б�
    function clearSongList(){
        this.source.songList.splice(0);
        this.element.src='';
        this.detection();
        clearInterval(this.refreshTime);
    }
    //��Ӹ���
    function addSong(songObj){
        this.source.songList.push(songObj);
    }
    //��ⲥ��Դ
    function detection(){
        clearInterval(this.time);
        var audio=this;
        this.time=setInterval(function(){
            if(audio.source.songList.length>0){
                audio.element.src=audio.source.songList[audio.source.playIndex].songSrc;
                audio.element.play();
                clearInterval(audio.time);
                clearInterval(audio.refreshTime);
                audio.refreshPercent();
            }
        },50);
    }

    //�л�Ϊ�������ģʽ
    function randomPlay(){
        this.source.playIndex=parseInt(Math.random()*this.source.songList.length);
        this.playModel=3;
        var joAudio=this;
        this.element.onended=function(){
            this.src=getRandomSong(joAudio.source.songList);
            this.play();
        }
    }
    //�л�Ϊ����ѭ��ģʽ
    function singeLoopPlay(){
        this.playModel=4;
        var joAudio=this;
        this.element.onended=function(){
            this.src=joAudio.source.songList[joAudio.source.playIndex].songSrc;
            this.play();
        }
    }
    //�л�Ϊ��������ģʽ
    function singePlay(){
        this.playModel=1;
        var joAudio=this;
        this.element.onended=function(){
            this.src=joAudio.source.songList[joAudio.source.playIndex].songSrc;
            this.pause();
        }
    }
    //�л�Ϊ�б���ģʽ
    function listPlay(){
        this.playModel=2;
        var joAudio=this;
        this.element.onended=function(){
            if(joAudio.source.playIndex+1>=joAudio.source.songList.length){
                joAudio.element.src=joAudio.source.songList[joAudio.source.playIndex].songSrc;
                joAudio.source.playIndex=0;
                joAudio.element.pause();
            }else{
                joAudio.source.playIndex++;
                joAudio.element.src=joAudio.source.songList[joAudio.source.playIndex].songSrc;
                joAudio.element.play();
            }
        }
    }
    //�л�Ϊ�б�ѭ��ģʽ
    function listLoopPlay(){
        this.playModel=5;
        var joAudio=this;
        this.element.onended=function(){
            if(joAudio.source.playIndex+1>=joAudio.source.songList.length){
                joAudio.source.playIndex=0;
            }else{
                joAudio.source.playIndex++;
            }
            this.src=joAudio.source.songList[joAudio.source.playIndex].songSrc;
            this.play();
        }
    }

    //--------------�����ṩ�¼�
    function singePlayEvent(){
        this.playModel=1;
        this.element.src=this.source.songList[this.source.playIndex].songSrc;
        this.element.pause();
    }
    function listPlayEvent(){
        this.playModel=2;
        if(this.source.playIndex+1>=this.source.songList.length){
            this.source.playIndex=0;
            this.element.src=this.source.songList[this.source.playIndex].songSrc;
            this.element.pause();
        }else{
            this.source.playIndex++;
            this.element.src=this.source.songList[this.source.playIndex].songSrc;
            this.element.play();
        }
    }
    function randomPlayEvent(){
        this.playModel=3;
        this.source.playIndex=parseInt(Math.random()*this.source.songList.length);
        this.element.src=this.source.songList[this.source.playIndex].songSrc;
        this.element.play();

    }
    function singeLoopPlayEvent(){
        this.playModel=4;
        this.element.src=this.source.songList[this.source.playIndex].songSrc;
        this.element.play();

    }
    function listLoopPlayEvent(){
        this.playModel=5;
        if(this.source.playIndex+1>=this.source.songList.length){
            this.source.playIndex=0;
        }else{
            this.source.playIndex++;
        }
        this.element.src=this.source.songList[this.source.playIndex].songSrc;
        this.element.play();
    }

    //���������Ÿ���
    function getRandomSong(songList){

        return songList[parseInt(Math.random()*songList.length)].songSrc;
    }
    //�������Ÿ���
    function changeSong(changeIndex){
        if(changeIndex<this.source.songList.length&&changeIndex>=0){
            this.source.playIndex=changeIndex;
        }else{
            this.source.playIndex=0;
        }
        this.element.src=this.source.songList[this.source.playIndex].songSrc;
        this.element.play();
    }
    //��û������
    function getBufferPercent(){
        var timeRages = this.element.buffered;
        if(timeRages.length==0){
            return this.bufferedPercent;
        }
        var timeBuffered = timeRages.end(timeRages.length - 1);
        this.bufferedPercent=timeBuffered / this.element.duration *100;
        return this.bufferedPercent;
    }
    //��ò��Ž���
    function getPlayPercent(){
        this.playPercent=this.element.currentTime/this.element.duration*100;
        return this.playPercent;
    }
    //�������Ž���
    function skipTo(percent){
        if(percent<this.bufferedPercent){
            this.element.currentTime=this.element.duration*percent/100;
            return true;
        }else{
            return false;
        }
    }
    //����
    function audioSwitch() {
        this.element.paused?this.element.play():this.element.pause();
    }
    //��������
    function increaseVolume(value){
        if(this.element.volume+value>1){
            this.element.volume=1;
        }else if(this.volume+value<0){
            this.element.volume=0;
        }else{
            this.element.volume+=value;
        }
    }
    //����
    function mutedSwitch(){
        this.element.muted=!this.element.muted;
    }
    //��Ⲣˢ�²��Ž��Ⱥͻ������
    function refreshPercent(){
        var audio=this;
        this.refreshTime=setInterval(function(){
            audio.getPlayPercent();
            audio.getBufferPercent();
        },50);
    }

    //--------------------------------------------------------
    /*
     setting{
     progress��{
     slideBar:jqObj,
     slideBlock:jqObj,
     slided:jqObj
     },
     btn:{
     switch:jqObj,
     next:jqObj,
     last:jqObj
     },
     volume:{
     slideBar:jqObj,
     slideBlock:jqObj,
     silent:jqObj,
     slided:jqObj
     }��
     time:{
     currentTime:jqObj
     duration:jqObj
     }
     */
    //��һ���¼�
    function nextEvent(){
        if(this.playModel==1||this.playModel==4){
            this.changeSong(this.source.playIndex+1);
        }
        this.element.onended();
    }
    //��һ���¼�
    function lastEvent(){
        //if(this.playModel==1||this.playModel==4){
            this.changeSong(this.source.playIndex-1);

        //}
        //console.info(this.source.playIndex);
        //this.element.onended();
    }
    //���ð�ť�¼�
    function setBtnEvent(){
        if(!this.setting.button){
            return false;
        }
        var joAudio=this;
        if(this.setting.button.switch){
            this.setting.button.switch.click(function(){
                joAudio.audioSwitch();
            });
        }
        if(this.setting.button.next){
            this.setting.button.next.click(function(){
                joAudio.nextEvent();
            });
        }
        if(this.setting.button.last){
            this.setting.button.last.click(function(){
                joAudio.lastEvent();
            });
        }
        if(this.setting.button.muted){
            this.setting.button.muted.click(function(){
                joAudio.mutedSwitch();
            })
        }
    }
    //���û����¼�
    function setSkipEvent(obj,type){
        if(type!='volume'&&type!='progress'){
            return;
        }
        var joAudio=this;
        var slideBlock=obj.slideBlock;
        var slideBar=obj.slideBar;
        slideBlock.mousedown(function(){
            $(document).bind('mousemove',skipTo);
        });
        //slideBlock.mouseout(function(){
            $(document).bind('mouseup',function(){
                $(document).unbind('mousemove',skipTo);
            });
        //});
        slideBar.click(skipTo);

        function skipTo(e){
            //var sBar=$('.slideBar',joAudio.container)[0];
            var slideBarWidth=parseInt(slideBar[0].offsetWidth);
            var slideBarLeft=parseInt(slideBar.offset().left);
            var slideBlockWidth=parseInt(slideBlock[0].offsetWidth);

            var move= (e.clientX-slideBarLeft-slideBlockWidth/2);
            if(move+1>slideBarWidth-slideBlockWidth){
                move=slideBarWidth;
            }else if(move-1<=0){
                move=0;
            }
            var skipPercent=move/slideBarWidth*100;
            if(type=='volume'){
                joAudio.increaseVolume((skipPercent/100)-joAudio.element.volume);
                var setPercent=joAudio.element.volume*100-5+'%';
                slideBlock.css({left:setPercent,position:'absolute'});
                obj.slided.css({
                    "width":setPercent
                })
            }else if(joAudio.skipTo(skipPercent)&&type=='progress'){
                slideBlock.css({left:skipPercent+'%',position:'absolute'});
            }else{
                var oldLeft=slideBlock.css('left');
                slideBlock.css({left:skipPercent+'%',position:'absolute'});
                setTimeout(function(){
                    slideBlock.css({left:oldLeft,position:'absolute'});
                },50);
            }

        }
    }
    //ͬ��������ͼ�Ľ���
    function synPercent(obj,type){
        if(type!='volume'&&type!='progress'){
            return;
        }

        var joAudio=this;
        if(type=='progress'){
            clearInterval(this.synPercentTimer);
            this.synPercentTimer=setInterval(function(){
                var setPercent=joAudio.playPercent+'%';
                obj.slideBlock.css(
                    {
                        position:'absolute',
                        left:setPercent
                    });
                if(obj.slided){
                    obj.slided.css({
                        'width':setPercent
                    })
                }
                if(joAudio.setting.time){
                    if(joAudio.setting.time.currentTime&&joAudio.element.currentTime){
                        joAudio.setting.time.currentTime.text(changeTime(joAudio.element.currentTime));

                    }
                    if(joAudio.setting.time.duration&&joAudio.element.duration){
                        joAudio.setting.time.duration.text(changeTime(joAudio.element.duration));
                    }
                }
            },100);
        }else{
            var setPercent=joAudio.element.volume*100-5+'%';
            this.setting.volume.slideBlock.css({left:setPercent,position:'absolute'});
            this.setting.volume.slided.css({'width':setPercent});
        }

    }
    function changeTime(time){
        var intTime=parseInt(time);
        var minute=parseInt(intTime/60);
        var second=intTime%60;
        if(minute<10){
            minute='0'+minute;
        }
        if(second<10){
            second='0'+second;
        }
        return (minute+":"+second);
    }
    //���캯��
    function JoAudio(audio,setting){
        this.element=audio;
        this.setting=setting;
    }
    //���ò���Դ����
    function setSource(source){
        this.source=source;
        this.detection();
        this.playModel=2;
        this.element.volume=0.5;
        this.refreshPercent();
        if(this.setting){
            if(this.setting.progress){
                this.setSkipEvent(this.setting.progress,'progress');
                this.synPercent(this.setting.progress,'progress');
            }
            if(this.setting.volume){
                this.setSkipEvent(this.setting.volume,'volume');
                this.synPercent(this.setting.progress,'volume');
            }
            this.setBtnEvent();

        }
    }
    JoAudio.prototype={
        setSource:setSource,
        clearSongList:clearSongList,
        addSong:addSong,
        detection:detection,
        randomPlay:randomPlay,
        singeLoopPlay:singeLoopPlay,
        singePlay:singePlay,
        listPlay:listPlay,
        listLoopPlay:listLoopPlay,
        changeSong:changeSong,
        getBufferPercent:getBufferPercent,
        getPlayPercent:getPlayPercent,
        skipTo:skipTo,
        audioSwitch:audioSwitch,
        increaseVolume:increaseVolume,
        mutedSwitch:mutedSwitch,
        refreshPercent:refreshPercent,
        setSkipEvent:setSkipEvent,
        synPercent:synPercent,
        setBtnEvent:setBtnEvent,
        nextEvent:nextEvent,
        lastEvent:lastEvent,
        listLoopPlayEvent:listLoopPlayEvent,
        singePlayEvent:singePlayEvent,
        listPlayEvent:listPlayEvent,
        randomPlayEvent:randomPlayEvent,
        singeLoopPlayEvent:singeLoopPlayEvent

    };
    //��ӵ�JQuery������
    $.fn.joAudio=function(setting){
        return new JoAudio(this[0],setting);
    };

})(jQuery);