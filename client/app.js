angular.module('angularBlogApp', ['ngRoute', 'ngResource', 'angularBlogApp.controllers', 'angularBlogApp.factories', 'angularBlogApp.services', 'angularBlogApp.directives'])
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
    .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginController'
    })
    .when('/users/:id/update', {
        templateUrl: 'views/user_update.html',
        controller: 'UpdateUserController'
    })
    .when('/users/:id', {
        templateUrl: 'views/single_user.html',
        controller: 'SingleUserController'
    })
    .when('/users', {
        templateUrl: 'views/user_list.html',
        controller: 'UserListController'
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