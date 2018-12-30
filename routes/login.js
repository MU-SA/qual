var express = require('express');
var router = express.Router();
var User = require('../models/User');
const storage = require('node-persist');
let logged = true;

/* GET home page. */
async function getData(res) {
    await storage.init();
    let length = await storage.length();
    console.log(length);
    if (length === 0)
        logged = false;
    if (logged) {
        res.redirect('/home');
    } else {
        console.log('not logged');
        res.render('login', {title: 'IA Project', Desc: 'IA Project'});
    }

}

router.get('/', function (req, res, next) {
    getData(res);
});

router.post('/', function (req, res) {
    var req_email = req.body.email;
    var password = req.body.password;
    console.log(req.body);
    // Validation
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('password', 'Password is required').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        res.render('login', {errors: errors})
    } else {
        User.findOne({email: req_email, password: password}, function (err, user) {
            console.log(user);
            if (user) {
                saveData(user, res);
            } else {
                res.render('login', {errors: [{param: 'email', msg: 'incorrect email or password', value: ''}]})
            }
        })
    }
});

async function saveData(user, res) {
    await storage.init(/* options ... */);
    await storage.setItem('email', user.email);
    await storage.setItem('name', user.name);
    await storage.setItem('phone', user.phone);
    await storage.setItem('birthdate', user.birthdate);
    await storage.setItem('type', user.type);
    res.redirect('/home');

}

module.exports = router;
