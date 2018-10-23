/**
 * Created by JoJo on 2016/11/22.
 */
(function($){
    //setting 'content' 'padding' 'border'
    function adjustCenter(targetObj,relativeObj,setting){
        var roWidth,roHeight;
        if(setting=='border'){
            roWidth=relativeObj.outerWidth();
            roHeight=relativeObj.outerHeight();
        }else if(setting=='padding'){
            roWidth=relativeObj.innerWidth();
            roHeight=relativeObj.innerHeight();
        }else{
            roWidth=relativeObj.width();
            roHeight=relativeObj.height();
        }

    }
    function widthEqHeight(obj){
        obj.width(obj.height());
    }
    function HeightEqWidth(obj){
        obj.height(obj.width());
    }
})(jQuery);