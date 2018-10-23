/**
 * Created by JoJo on 2016/11/17.
 */
var joApp=angular.module('joApp',
    ['joController','joDirective','joService','ui.router','joRouter']);

joApp.run(['$rootScope','$state','$stateParams',function($rootScope,$state,$stateParams){
    $rootScope.$state=$state;
    $rootScope.$starteParams=$stateParams;
    console.info('running.....');
    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
        console.info('successfully changed states') ;
        if($rootScope.playHomeHolder){
            $rootScope.playHomeHolder.hide();
            $rootScope.playHomeHolder.fadeIn(1000);
        }

    });
}]);
