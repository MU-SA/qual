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
            res.render('post_job', {logged: "logged", hr: 'hr', name: name});
        } else {
            res.redirect('/home')
        }
    }
}

router.get('/', function (req, res) {

    check(res, req);
});

async function getType() {

}

router.post('/', function (req, res) {
    req.checkBody('job_title', 'Job title is required').notEmpty();
    req.checkBody('company_name', 'Company name is required').notEmpty();
    req.checkBody('job_desc', 'job description is required').notEmpty();
    req.checkBody('job_loc', 'job location is required').notEmpty();
    let errors = req.validationErrors();

    if (errors) {
        if (type === 'hr') {

            res.render('post_job', {errors: errors, logged: "logged", hr: "hr", name: name})
        } else {
            res.render('post_job', {errors: errors, logged: "logged", hr: "hr", name: name})
        }

    } else {
        let job = {
            job_title: req.body.job_title,
            company_name: req.body.company_name,
            job_loc: req.body.job_loc,
            job_desc: req.body.job_desc
        };
        User.findOne({email: email}, function (err, user) {
            if (user) {
                user.jobs.push(job);
                user.save();
                res.redirect('/home')
            }else{
                res.render('error', {error:"no such user"})
            }
        })
    }

});

module.exports = router;