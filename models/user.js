const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');
const config=require('../config/database');

const userschema= mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

const User=module.exports =mongoose.model('User',userschema);

module.exports.getUserById = function(id,callback){
    User.findById(id,callback);
}

module.exports.getUserByUserName =function(username,callback){
    const query={username : username}
    User.findOne(query,callback);
}

module.exports.addUser =function(newuser, callback){
    bcrypt.genSalt(10, (err, salt)=>{
        bcrypt.hash(newuser.password,salt,(err,hash)=>{
            if(err) throw err;
            newuser.password =hash;
            newuser.save(callback);
        });
    });
}

module.exports.comparePassword =function(password,hash,callback){
    bcrypt.compare(password,hash,(err,isMatch)=>{
        if(err)
        throw err;
        callback(null,isMatch);
    });
}