var express = require('express');
var procedures = require('../procedures/posts.proc');

var router = express.Router();

// really /api/posts/
router.route('/')
    .get(function(req, res) {
        procedures.all()
        .then(function(posts) {
            res.send(posts);
        }, function(err) {
            console.log(err);
            res.sendStatus(500);
        });
    })
    .post(function(req, res) {
        procedures.create(req.body.title, req.body.content, req.body.userid, req.body.categoryid)
        .then(function (id) {
            res.status(201).send(id);
        }, function (err) {
            console.log(err);
            res.sendStatus(500);
        });
    });

// really /api/posts/:id
router.route('/:id')
    .get(function(req, res) {
        procedures.read(req.params.id)
        .then(function(post) {
            res.send(post);
        }).catch(function(err) {
            console.log(err);
            res.sendStatus(500);
        });
    })
    .put(function(req, res) {
        procedures.update(req.body.title, req.body.content, req.body.categoryid, req.params.id)
        .then(function() {
            res.sendStatus(204);
        }).catch(function(err) {
            console.log(err);
            res.sendStatus(500);
        });
    })
    .delete(function(req, res) {
        procedures.destroy(req.params.id)
        .then(function() {
            res.sendStatus(204);
        }).catch(function(err) {
            console.log(err);
            res.sendStatus(500);
        });
    });

module.exports = router;