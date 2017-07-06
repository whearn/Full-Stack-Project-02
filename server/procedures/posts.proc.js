var db = require('../config/db');

exports.all = function() {
    return db.rows('GetPosts');
}

exports.read = function(id) {
    return db.row('GetSinglePost', [id]);
}

exports.update = function(title, content, categoryid, userid) {
    return db.empty('UpdatePost', [title, content, categoryid, userid]);
}

exports.destroy = function(id) {
    return db.empty('DeletePost', [id]);
}

exports.create = function(title, content, userid, categoryid) {
    return db.row('InsertPost', [title, content, userid, categoryid]);
}