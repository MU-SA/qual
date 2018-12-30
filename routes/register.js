var express = require('express');
var router = express.Router();
var User = require('../models/User');
const storage = require('node-persist');

let logged = true;

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
        res.render('register', {title: 'IA Project', Desc: 'IA'});
    }
}


/* GET home page. */
router.get('/', function (req, res, next) {
    getData(res)
});

router.post('/', function (req, res) {
    var req_name = req.body.name;
    var req_email = req.body.email;
    var req_password = req.body.password;
    var password2 = req.body.password2;
    var req_b_day = req.body.b_day;
    var req_b_month = req.body.b_month;
    var req_b_year = req.body.b_year;
    var req_gender = req.body.gender;
    var req_type = req.body.type;
    var req_phone = req.body.phone;
    console.log(req.body);
    // Validation
    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);


    var errors = req.validationErrors();
    if (errors) {
        console.log(errors)
        res.render('register', {
            errors: errors
        })
    } else {
        User.getUserByEmail(req.body.email, function (err, email) {
            if (email) {
                errors.exist = 'email already in use';
                console.log('already in use');
                res.render('register', {errors: [{param: 'email', msg: 'email already in use', value: ''}]})
            } else {
                let phone = "not assigned";
                let gender = "not assigned";
                let type = "user";
                if (req_phone) {
                    phone = req_phone;
                }
                if (req_gender) {
                    gender = req_gender;
                }
                if (req_type) {
                    type = req_type;
                }
                let birtdate = 'not assigned';
                if (req_b_day && req_b_month && req_b_year) {
                    birtdate = req_b_day + ', ' + req_b_month + ', ' + req_b_year;
                }
                const newUser = new User({
                    email: req_email,
                    name: req_name,
                    password: req_password,
                    birthdate: birtdate,
                    phone: phone,
                    gender: gender,
                    type: type

                });

                User.createUser(newUser, function (err, user) {
                    if (err) {
                        throw err;
                    }
                    saveData(user, res);
                })
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
