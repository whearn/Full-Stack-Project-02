var express = require('express');
var procedures = require('../procedures/users.proc');

var router = express.Router();

// actually /api/users/
router.route('/')
    .get(function(req, res) {
        procedures.all()
        .then(function(users) {
            res.send(users);
        }).catch(function(err) {
            console.log(err);
            res.sendStatus(500);
        });
    });

module.exports = router;