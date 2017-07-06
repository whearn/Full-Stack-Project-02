var mysql = require('mysql');

var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'angularBlogUser',
    password: 'gurmagangular',
    database: 'AngularBlog'
});

exports.rows = function(procedureName, args) {
    return callProcedure(procedureName, args)
            .then(function(resultsets) {
                return resultsets[0];
            });
}

exports.row = function(procedureName, args) {
    return callProcedure(procedureName, args)
            .then(function(resultsets) {
                return resultsets[0][0];
            });
}

exports.empty = function(procedureName, args) {
    return callProcedure(procedureName, args)
            .then(function() {
                return;
            });
}

function callProcedure(procedureName, args) {
    return new Promise(function(resolve, reject) {
        pool.getConnection(function(err, connection) {
            if (err) {
                reject(err);
            } else {
                var placeholders = '';
                if (args && args.length > 0) {
                    for (var i = 0; i < args.length; i++) {
                        if (i === args.length - 1) { // if we are on the last argument in the array
                            placeholders += '?';
                        } else {
                            placeholders += '?,';
                        }
                    }
                }
                var callString = 'CALL ' + procedureName + '(' + placeholders + ');'; // CALL GetPosts();, or CALL InsertPost(?,?,?);
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