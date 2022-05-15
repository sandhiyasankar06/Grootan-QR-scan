const express=require('express');
const path=require('path');
const bodyParser=require('body-parser');
const cors=require('cors');
const passport=require('passport');
const mongoose=require('mongoose');
const config=require('./config/database');
//const session = require('express-session');

mongoose.connect(config.database);

mongoose.connection.on('connected',()=>{
    console.log("Connected to database");
})

// mongoose.connection.on('error',  (err)=>{
//     console.log("Database Connection error: "+err);
// })

const app=express();

const users=require('./routes/users');
//const { config } = require('process');

const port=3000;

app.use(cors());

app.use(express.static(path.join(__dirname,'public'))); 

app.use(bodyParser.json()); 

app.use(passport.initialize());
//app.use(passport.session()); 

//app.use(session({ secret: 'yoursecret' }));
//const oneDay = 1000 * 60 * 60 * 24;

//session middleware
/*app.use(session({
    secret: "yoursecret",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false
}));*/


require('./config/passport')(passport);
 
app.use('/users',users);

app.get('/',(req,res)=>{
    res.send("Invalid endpoint");
})

app.listen(port ,()=>{
    console.log('Server started');
})
 