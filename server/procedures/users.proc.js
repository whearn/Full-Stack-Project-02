var db = require('../config/db');

exports.readByEmail = function(email) {
    return db.row('GetUserByEmail', [email]);
}

exports.all = function() {
    return db.rows('GetUsers');
}

exports.read = function(id) {
    return db.row('GetUser', [id]);
}

exports.update = function(firstname, lastname, email, password, userid) {
    return db.empty('UpdateUser', [firstname, lastname, email, password, userid]);
}

exports.destroy = function(id) {
    return db.empty('DeleteUser', [id]);
}

exports.create = function(firstname, lastname, email, password) {
    return db.row('InsertUser', [firstname, lastname, email, password]);
}