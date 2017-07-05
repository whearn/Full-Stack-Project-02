angular.module('angularBlogApp', ['ngRoute', 'ngResource', 'angularBlogApp.controllers', 'angularBlogApp.factories'])
.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider
    .when('/', {
        templateUrl: 'views/post_list.html',
        controller: 'PostListController'
    })
    .when('/compose', {
        templateUrl: 'views/compose.html',
        controller: 'ComposeController'
    })
    .when('/:id/update', {
        templateUrl: 'views/post_update.html',
        controller: 'UpdateController'
    })
    .when('/:id', {
        templateUrl: 'views/single_post.html',
        controller: 'SinglePostController'
    })
    .otherwise({
        redirectTo: '/'
    })
}]);