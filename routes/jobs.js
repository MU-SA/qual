var express = require('express');
var router = express.Router();
var User = require('../models/User');
const storage = require('node-persist');

let logged = true;

let type = '';
let name = '';
let email = "";

async function check(res, req) {
    await storage.init();
    let length = await storage.length();
    if (length === 0) {
        res.redirect('/home')
    } else {
        type = await storage.getItem('type');
        name = await storage.getItem('name');
        email = await storage.getItem('email');
        if (type === 'hr') {
            getJobs(res);
        } else {
            res.redirect('/home')
        }
    }
}

router.get('/', function (req, res) {

    check (res, req);
});

function getJobs(res){
    User.getUserByEmail(email, function (err, user) {
        if(err)
            throw err;
        res.render('jobs', {logged: "logged", hr: 'hr', name: name, jobs:user.jobs});

    })
}
module.exports = router;