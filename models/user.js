var mongoose =  require('mongoose');

var userSchema = new mongoose.Schema({
    firstname:{type:String},
    username:{type:String},
    email:{type:String, unique:true, required:true},
    hashedpw:String,
    role:String,
    created:{type:Date, default:Date.now}
});

var User = mongoose.model('User', userSchema);

module.exports = {
    User:User
};