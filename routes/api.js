/*
 This is the controller set up to handle this url: mydomain.com/api/user
 It is used to pass back a json array of user to whoever is calling it (maybe a local angular app, or an outside caller)
 */
var express = require('express');
var router = express.Router();
var userService = require('../services/user-service');
var User = require('../models/user').User;


// Routes
router.get('/', function(req, res) {
   res.send('api works!');
});

router.get('/status',  function(req, res){
    res.send(req.session.username);
});

router.get('/:userid', function (req, res, next) {
        userService.getUser(req.params.userid, function (err, user) {
            if (err) {
                console.log(err);
                return next(err);
            }
            return res.send(user.username);
        });
  
});



module.exports = router;
