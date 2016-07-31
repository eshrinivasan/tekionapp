var express = require('express'),
    router = express.Router(),
    crypto = require('crypto'),
    User = require('../models/user').User;

router.get('/', function(req, res) {
    if (req.session.user) {
        //res.sendFile('../public/admin.ejs'); // load the single view file (angular will handle the page changes on the front-end)
        var vm = {
            title: 'Upcoming',
            logmsg: req.session.user ? 'Welcome, '+req.session.username : ''
        };
        return res.render('index', vm);
    } else {
        req.session.msg = 'Login to access this page';
        res.redirect('/login');
    }
});

// utility function to create a hashed password to store in mongo users collection
function hashPassword(pwd) {
    var pw = crypto.createHash('sha256').update(pwd).digest('base64').toString();
    return pw;
}

// if a session already exists for this user, redirect to the home page
// if not, display the signup form
router.get('/signup', function (req, res) {
    if (req.session.user) {
        res.redirect('/');
    }
    var vm = {
        title: "Sign up for an account",
        msg: req.session.msg,
        logmsg: req.session.user ? 'Welcome, '+req.session.username : ''
    }
    res.render('signup', vm);
});

// handle data posted from signup forrm
router.post('/signup', function (req, res) {
    var user = new User({username: req.body.username});
    user.set('hashedpw', hashPassword(req.body.password));
    user.set('email', req.body.email);
    user.save(function (err) {
        if (err) {
            res.session.error = err;
            res.redirect('/signup');
        } else {
            req.session.user = user._id;
            req.session.username = user.username;
            req.session.msg = 'Authenticated as ' + user.username;
            res.redirect('/');
        }
    });
});

router.get('/login',  function(req, res){
    if(req.session.user){
        res.redirect('/');
    }
    var vm = {
        title:"Login",
        msg: req.session.msg,
        logmsg: req.session.user ? 'Welcome, '+req.session.username : ''
    }
    res.render('login', vm);
});

router.post('/login', function (req, res) {
    User.findOne({username: req.body.username})
        .exec(function (err, user) {
            if (!user) {
                err = 'User Not Found.';
            } else if (user.hashedpw ===
                hashPassword(req.body.password.toString())) {
                req.session.regenerate(function () {
                    req.session.user = user.id;
                    req.session.username = user.username;
                    req.session.msg = 'Welcome, ' + user.username;
                    res.redirect('/');
                });
            } else {
                err = 'Authentication failed.';
            }
            if (err) {
                req.session.regenerate(function () {
                    req.session.msg = err;
                    res.redirect('/login');
                });
            }
        });
});

router.get('/logout', function(req, res){
    req.session.destroy(function(){
        res.redirect('/login');
    })
});


module.exports = router;
