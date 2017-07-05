angular.module('angularBlogApp.controllers', [])
.controller('PostListController', ['$scope', 'Post', '$location', function($scope, Post, $location) {
    $scope.posts = Post.query();

    $scope.composePost = function() {
        $location.path('/compose');
    }
}])
.controller('SinglePostController', ['$scope', 'Post', '$location', '$routeParams', function($scope, Post, $location, $routeParams) {
    $scope.post = Post.get({ id: $routeParams.id });

    $scope.updatePost = function() {
        $location.path('/' + $routeParams.id + '/update');
    }

    $scope.deletePost = function() {
        if(confirm('Are you sure you want to delete this post?')) {
            $scope.post.$delete(function(success) {
                $location.replace().path('/');
            }, function(err) {
                console.log(err);
            })
        }
    }
}])
.controller('ComposeController', ['$scope', 'Post', 'User', 'Category', '$location', function($scope, Post, User, Category, $location) {
    $scope.posts = Post.query();
    $scope.users = User.query();
    $scope.categories = Category.query();

    $scope.savePost = function() {
        var payload = {
            title: $scope.newTitle,
            content: $scope.newContent,
            userid: $scope.newUserId,
            categoryid: $scope.newCategory
        };

        var p = new Post(payload);

        p.$save(function(success) {
            $location.replace().path('/');
        }, function(err) {
            console.log(err)
        });
    }
}])
.controller('UpdateController', ['$scope', 'Post', 'Category', '$location', '$routeParams', function($scope, Post, Category, $location, $routeParams) {
    $scope.post = Post.get({ id: $routeParams.id }, function() {
        // post was retrieved successfully
        $scope.post.categoryid = String($scope.post.categoryid);
    });
    $scope.categories = Category.query();

    $scope.updatePost = function() {
        $scope.post.$update(function(success) {
            $location.path('/' + $routeParams.id);
        }, function(err) {
            console.log(err);
        });
    }
}])