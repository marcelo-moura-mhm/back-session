const express = require('express');
const session = require('express-session');
const bodyparser = require('body-parser');
const path = require('path');
const ejs = require('ejs');
const { log } = require('console');

const app = express();

app.use(session({
    secret:'fhsofisj!392fhsf3jh?3',
    resave:true,
    saveUninitialized:true
}));
app.use(bodyparser.urlencoded({extended:true}));

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

var users = [
    {
        username: 'admin',
        email: 'admin@bcsession.com',
        password: '123'
    }
];

var logged = false;

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/', (req, res) => {

    console.log(users);

    users.forEach((obj) => {
        if(req.body.username == obj.username && req.body.password == obj.password){
            logged = true;
        }
    });
    if(logged){
        res.render('logged', {username:req.body.username});
    }else{
        res.render('index');
    }
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
        users.push({username: req.body.username, email: req.body.email, password: req.body.password});
        res.redirect('/');
    }
});

app.listen(3000, () => {
    console.log('Server running!');
});