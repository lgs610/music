/**
 * Created by JoJo on 2016/11/20.
 */
angular.module('joRouter',['ui.router','joController'])
    .config(function($stateProvider,$urlRouterProvider){
        $urlRouterProvider.when("", "/adv");
        $stateProvider.state('/songMenu',{
            url:'/songMenu:smId',
            templateUrl:'template/songMenu.html',
            controller:'songMenuController'
        }).state('/',{
            url:'/',
            templateUrl:'template/albumContent.html',
            controller:'albumContentController'
        }).state('/adv',{
            url:'/adv',
            templateUrl:'template/advPage.html',
            controller:'advController'
        })
    });