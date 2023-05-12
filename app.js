const express = require('express');
const session = require('express-session');
const bodyparser = require('body-parser');
const path = require('path');
const ejs = require('ejs');
const bcrypt = require('bcrypt');

const app = express();

app.use(session({
    secret:'fhsofisj!392fhsf3jh?3',
    resave:true,
    saveUninitialized:true
}));
app.use(bodyparser.urlencoded({extended:true}));

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

var users = [];

var logged = false;

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/', (req, res) => {

    console.log(users);

    users.forEach((obj) => {
        if(req.body.username == obj.username){
            bcrypt.compare(req.body.password, obj.password, (err, value) => {
                if(value){
                    res.render('logged', {username:req.body.username});
                    logged = true
                }
            });
        };
    });
    if(!logged){
        res.send('<p>User not registered or wrong password</p><form action="/" method="get"><input type=submit /></form>');
    }
    /*if(logged){
        res.render('logged', {username:req.body.username});
    }else{
        res.render('index');
    }*/
});

app.post('/logout', (req, res) => {
    logged = false
    req.session.destroy(() => {
        res.redirect('/');
    });
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', (req, res) => {
    let valid_email = true;
    users.forEach((obj) => {
        if(req.body.email == obj.email){
            res.send('Email already registered!');
            valid_email = false;
        }
    });
    if(valid_email){
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(req.body.password, salt, (err, hash) => {
                users.push({username: req.body.username, email: req.body.email, password: hash});
            });
        });
        //users.push({username: req.body.username, email: req.body.email, password: req.body.password});
        res.redirect('/');
    }
});

app.listen(3000, () => {
    console.log('Server running!');
});