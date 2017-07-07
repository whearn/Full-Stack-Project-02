angular.module('angularBlogApp.controllers', [])
.controller('PostListController', ['$scope', 'Post', '$location', function($scope, Post, $location) {
    $scope.posts = Post.query();

    $scope.composePost = function() {
        $location.path('/compose');
    }

    $scope.goToLogin = function() {
        $location.path('/login');
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
.controller('UserListController', ['$scope', 'User', 'UserService', '$location', function($scope, User, UserService, $location) {
    UserService.requireLogin();
    $scope.users = User.query();

    $scope.saveUser = function() {
        var payload = {
            firstname: $scope.newFirstName,
            lastname: $scope.newLastName,
            email: $scope.newEmail,
            password: $scope.newPassword
        };

        var u = new User(payload);

        u.$save(function(success) {
            $scope.newFirstName = '';
            $scope.newLastName = '';
            $scope.newEmail = '';
            $scope.newPassword = '';
            $scope.users = User.query();
        }, function(err) {
            console.log(err)
        });
    }
}])
.controller('SingleUserController', ['$scope', 'User', 'UserService', '$location', '$routeParams', function($scope, User, UserService, $location, $routeParams) {
    UserService.requireLogin();
    $scope.user = User.get({ id: $routeParams.id });

    $scope.updateUser = function() {
        $location.path('/users/' + $routeParams.id + '/update');
    }

    $scope.deleteUser = function() {
        if(confirm('Are you sure you want to delete this user?')) {
            $scope.user.$delete(function(success) {
                $location.replace().path('/users');
            }, function(err) {
                console.log(err);
            })
        }
    }
}])
.controller('UpdateUserController', ['$scope', 'User', 'UserService', '$location', '$routeParams', function($scope, User, UserService, $location, $routeParams) {
    UserService.requireLogin();
    $scope.user = User.get({ id: $routeParams.id });

    $scope.updateUser = function() {
        $scope.user.$update(function(success) {
            $location.path('/users/' + $routeParams.id);
        }, function(err) {
            console.log(err);
        });
    }
}])
.controller('LoginController', ['$scope', '$location', 'UserService', function ($scope, $location, UserService) {
    UserService.me().then(function() {
        redirect();
    });

    $scope.login = function() {
        UserService.login($scope.email, $scope.password)
        .then(function () {
            redirect();
        }, function (err) {
            console.log(err);
        });
    }

    function redirect() {
        var dest = $location.search().dest;

        if (!dest) {
            dest = '/';
        }
        
        $location.replace().path(dest).search('dest', null);
    }
}]);