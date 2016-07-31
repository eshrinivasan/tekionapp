var express = require('express'),
    router = express.Router(),
    userService = require('../services/user-service');

/*
 This is the controller set up to handle these urls: mydomain.com/users and mydomain.com/users/<userid>
 */
router.get('/', function (req, res, next) {
    if (req.session.user) {
        userService.getUsers(function (err, users) {
            if (err) {
                console.log(err);
                return next(err);
            }
            var vm = {
                title: 'Users',
                users: users,
                logmsg: req.session.user ? 'Welcome, ' + req.session.username : ''
            };
            return res.render('users/index', vm);
        })
    } else {
        req.session.msg = 'Login to access the users page';
        res.redirect('/login');
    }
});

router.get('/:userid', function (req, res, next) {
    if (req.session.user) {
        userService.getUser(req.params.userid, function (err, user) {
            if (err) {
                console.log(err);
                return next(err);
            }
            var vm = {
                title: user.username + "'s Profile",
                user:user,
                logmsg: 'Welcome, ' + user.username
            }
            return res.render('users/details', vm);
        });
    } else {
        req.session.msg = 'Login to access this page';
        res.redirect('/login');
    }
});


module.exports = router;
