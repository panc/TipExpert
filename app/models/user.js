var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = Schema({
    name: String,
    age: { type: Number, default: 10 }
});

mongoose.model('User', userSchema);