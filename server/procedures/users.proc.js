var db = require('../config/db');

//add stored
exports.readByEmail = function(email) {
    return db.row('GetUserByEmail', [email]);
}

exports.all = function() {
    return db.rows('GetUsers');
}

//add stored
exports.read = function(id) {
    return db.row('GetUser', [id]);
}