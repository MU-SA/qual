var express = require('express');
var router = express.Router();
var User = require('../models/User');
const storage = require('node-persist');
var formidable = require('formidable');
var fs = require('fs');

let name = "";
let email = "";
let type = "";

async function getData(res, req) {
    let search_result = [];
    await storage.init();
    name = await storage.getItem('name');
    console.log(req.body);
    switch (req.body.search_option) {
        case "name":
            console.log('name' + req.body.query);
            User.find({name: req.body.query}, function (err, users) {

                users.forEach(function (user) {
                    search_result.push(user);
                });
                console.log(users)
                res.render('search', {logged: "logged", hr: 'hr', name: name, search_result: search_result})

            });
            break;
        case "email":
            console.log('name' + req.body.query);
            User.find({email: req.body.query}, function (err, users) {

                users.forEach(function (user) {
                    search_result.push(user);
                });
                console.log(users)
                res.render('search', {logged: "logged", hr: 'hr', name: name, search_result: search_result})

            });
            break;
        case "ex_date":

        case "ex_type":


    }
}

router.post('/', function (req, res) {
    getData(res, req);

});

async function validate(res) {
    await storage.init();

    let length = await storage.length();
    if (length > 0) {
        type = await storage.getItem('type');
        name = await storage.getItem('name');
        if (type === 'hr') {
            res.render('search', {logged: "logged", hr: 'hr', name: name})
        } else {
            res.redirect('/home')
        }
    }
}

router.get('/', function (req, res) {
    validate(res)
});

module.exports = router;