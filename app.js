const express = require('express');
const session = require('express-session');
const bodyparser = require('body-parser');
const path = require('path');
const ejs = require('ejs');

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
        password: 123
    }
];

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/', (req, res) => {
    users.forEach((obj) => {
        if(req.body.username == obj.username && req.body.password == obj.password){
            res.render('logged', {username:req.body.username});
        }
    });
    res.render('index');
});

app.listen(8000, () => {
    console.log('Server running!');
});