var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');

var clientPath = path.join(__dirname, '../client');

var app = express();
app.use(express.static(clientPath));
app.use(bodyParser.json());

var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'angularBlogUser',
    password: 'gurmagangular',
    database: 'AngularBlog'
});

app.route('/api/posts')
    .get(function(req, res) {
        rows('GetPosts')
        .then(function(posts) {
            res.send(posts);
        }).catch(function(err) {
            console.log(err);
            res.sendStatus(500);
        });
    }).post(function(req, res) {
        var newPost = req.body;
        row('InsertPost', [newPost.title, newPost.content, newPost.userid, newPost.categoryid])
        .then(function(id) {
            res.status(201).send(id);
        }).catch(function(err) {
            console.log(err);
            res.sendStatus(500);
        });
    });
app.route('/api/posts/:id')
    .get(function(req, res) {
        row('GetSinglePost', [req.params.id])
        .then(function(post) {
            res.send(post);
        }).catch(function(err) {
            console.log(err);
            res.sendStatus(500);
        });
    }).put(function(req, res) {
        empty('UpdatePost', [req.body.title, req.body.content, req.body.categoryid, req.params.id])
        .then(function() {
            res.sendStatus(204);
        }).catch(function(err) {
            console.log(err);
            res.sendStatus(500);
        });
    }).delete(function(req, res) {
        empty('DeletePost', [req.params.id])
        .then(function() {
            res.sendStatus(204);
        }).catch(function(err) {
            console.log(err);
            res.sendStatus(500);
        });
    });

app.get('/api/users', function(req, res) {
    rows('GetUsers')
    .then(function(users) {
        res.send(users);
    }).catch(function(err) {
        console.log(err);
        res.sendStatus(500);
    });
});

app.get('/api/categories', function(req, res) {
    rows('GetCategories')
    .then(function(categories) {
        res.send(categories);
    }).catch(function(err) {
        console.log(err);
        res.sendStatus(500);
    });
});

app.get('*', function(req, res, next) {
    if (isAsset(req.url)) {
        return next(); //Call the next route handler
    } else {
        res.sendFile(path.join(clientPath, 'index.html'));
    }
});

app.listen(3000);

function callProcedure(procedureName, args) { //args === arguments
    return new Promise(function(resolve, reject) {
        pool.getConnection(function(err, connection) {
            if (err) {
                reject(err);
            } else {
                var placeholders = '';
                if(args && args.length > 0) {
                    for (var i = 0; i < args.length; i++) {
                        if (i === args.length - 1) { //if we are on the last argument in the array
                            placeholders += '?';
                        } else {
                            placeholders += '?,';
                        }
                    }
                }
                var callString = 'CALL ' + procedureName + '(' + placeholders + ')'; //CALL GetPosts();, or CALL InsertPost(?,?,?);
                connection.query(callString, args, function(err, resultsets) {
                    connection.release();
                    if (err) {
                        reject(err);
                    } else {
                        resolve(resultsets);
                    }
                });
            }
        });
    });
}

function rows(procedureName, args) {
    return callProcedure(procedureName, args)
        .then(function(resultsets) {
            return resultsets[0];
        });
}

function row(procedureName, args) {
    return callProcedure(procedureName, args)
        .then(function(resultsets) {
            return resultsets[0][0];
        });
}

function empty(procedureName, args) {
    return callProcedure(procedureName, args)
        .then(function() {
            return;
        });
}

function isAsset(path) {
    var pieces = path.split('/');
    if (pieces.length === 0) { return false; }
    var last = pieces[pieces.length - 1];
    if (path.indexOf('/api') !== -1 || path.indexOf('/?') !== -1) {
        return true;
    } else if (last.indexOf('.') !== -1) {
        return true;
    } else {
        return false;
    }
}