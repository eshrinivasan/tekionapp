var mongoose =  require('mongoose');

 // define model =================

var todoSchema = new mongoose.Schema({  
	  text:{type:String}
});

var Todo = mongoose.model('Todo', todoSchema);

module.exports = {
    Todo:Todo
};