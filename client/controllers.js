angular.module('angularBlogApp.controllers', [])
.controller('PostListController', ['$scope', 'Post', 'SEOService', '$location', function($scope, Post, SEOService, $location) {
    $scope.posts = Post.query();

    $scope.composePost = function() {
        $location.path('/compose');
    }

    $scope.goToLogin = function() {
        $location.path('/login');
    }

    SEOService.setSEO({
        title: 'Angular Blog',
        url: $location.url(),
        description: 'Welcome to my Angular Blog'
    })
}])
.controller('SinglePostController', ['$scope', 'Post', 'SEOService', '$location', '$routeParams', function($scope, Post, SEOService, $location, $routeParams) {
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

    SEOService.setSEO({
        title: 'Post',
        url: $location.url(),
        description: 'Post'
    })
}])
.controller('ComposeController', ['$scope', 'Post', 'User', 'Category', 'SEOService', '$location', function($scope, Post, User, Category, SEOService, $location) {
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

    SEOService.setSEO({
        title: 'Compose a Post',
        url: $location.url(),
        description: 'Compose a Post'
    })
}])
.controller('UpdateController', ['$scope', 'Post', 'Category', 'UserService', 'SEOService', '$location', '$routeParams', function($scope, Post, Category, UserService, SEOService, $location, $routeParams) {
    UserService.requireLogin();
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
    SEOService.setSEO({
        title: 'Update Post',
        url: $location.url(),
        description: 'Update Post'
    })
}])
.controller('UserListController', ['$scope', 'User', 'UserService', 'SEOService', '$location', function($scope, User, UserService, SEOService, $location) {
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

    SEOService.setSEO({
        title: 'Users',
        url: $location.url(),
        description: 'User List'
    })
}])
.controller('SingleUserController', ['$scope', 'User', 'UserService', 'SEOService', '$location', '$routeParams', function($scope, User, UserService, SEOService, $location, $routeParams) {
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

    SEOService.setSEO({
        title: 'User',
        url: $location.url(),
        description: 'User Details'
    })
}])
.controller('UpdateUserController', ['$scope', 'User', 'UserService', 'SEOService', '$location', '$routeParams', function($scope, User, UserService, SEOService, $location, $routeParams) {
    UserService.requireLogin();
    $scope.user = User.get({ id: $routeParams.id });

    $scope.updateUser = function() {
        $scope.user.$update(function(success) {
            $location.path('/users/' + $routeParams.id);
        }, function(err) {
            console.log(err);
        });
    }

    SEOService.setSEO({
        title: 'Update User',
        url: $location.url(),
        description: 'Update User'
    })
}])
.controller('LoginController', ['$scope', '$location', 'UserService', 'SEOService', function ($scope, $location, UserService, SEOService) {
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

    SEOService.setSEO({
        title: 'Login',
        url: $location.url(),
        description: 'Login to Angular Blog'
    })

    function redirect() {
        var dest = $location.search().dest;

        if (!dest) {
            dest = '/';
        }
        
        $location.replace().path(dest).search('dest', null);
    }
}])
.controller('DonationController', ['$scope', '$location', 'Donation', 'SEOService', function($scope, $location, Donation, SEOService) {
    //stripe global variable created in index.html
    var elements = stripe.elements();
    var card = elements.create('card');
    card.mount('#card-field');

    //sets length to 0 so that .length === 0, and will not show until an error is created
    $scope.errorMessage = '';

    $scope.processDonation = function() {
        stripe.createToken(card, {
            name: $scope.name,
            address_line1: $scope.line1,
            address_line2: $scope.line2,
            address_city: $scope.city,
            address_state: $scope.state
        }).then(function(result) {
            if (result.error) {
                $scope.errorMessage = result.error.message;
            } else {
                //result.token is the card token
                var d = new Donation({
                    token: result.token.id,
                    amount: $scope.amount
                });
                d.$save(function() {
                    alert('Thank you for the donation!');
                    $location.path('/');
                }, function(err) {
                    console.log(err);
                });
            }
        });
    }

    SEOService.setSEO({
        title: 'Donate',
        url: $location.url(),
        description: 'Donate to Angular Blog!'
    })
}]);