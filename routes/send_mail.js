const express = require('express');
const router = express.Router();
const storage = require('node-persist');
const User = require('../models/User');
let nodemailer = require('nodemailer');
let email = '';
let name = '';
let candidates = [];
let jobs = [];
var mongo = require('mongodb');

async function send_mail(data, res) {
    await storage.init();
    email = await storage.getItem('email');
    console.log(data)
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'QualifyX@gmail.com',
            pass: 'QualifyXQualifyX'
        }
    });


    var mailOptions = {
        from: 'QualifyX@gmail.com',
        to: data.email.replace('/', ''),
        subject: 'QualifyX',
        text: 'You have been approved'
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
    User.findOne({email: email}, function (err, user) {
        if (err)
            throw err;
        console.log(email);
        console.log(user);
        let job_id = new mongo.ObjectId(data.job_id.replace('/', ''));
        for (let i = 0; i < user.jobs.length; i++) {
            if ('' + new mongo.ObjectId(user.jobs[i]._id) === '' + job_id) {
                for (let j = 0; j < user.jobs[i].candidates.length; j++) {
                    if (user.jobs[i].candidates[j].id.replace('/', '') === data.email.replace('/', '')) {
                        let by = "jobs." + i + ".candidates.$.approved";
                        let queryParam = {};
                        queryParam[by] = true;
                        User.update({"jobs.candidates.id": data.email.replace('/', '')},
                            {"$set": queryParam},
                            function (err, numAff) {
//klsaxkla
                            })
                    }
                }
            }
        }
    });
    res.redirect('/submissions');

}

router.post('/', function (req, res) {
    send_mail(req.body, res);
});
module.exports = router;