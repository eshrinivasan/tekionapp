var User = require('../models/user').User;

exports.getUsers = function(next) {
    User.find({}, function(err, users) {
        next(err, users);
    })
};

exports.getUser = function(id, next) {
    User.findById(id, function(err, user) {
        next(err, user);
    })
}
