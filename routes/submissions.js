const express = require('express')
const router = express.Router();
const storage = require('node-persist');
const User = require('../models/User')

let email = '';
let name = '';
let candidates = [];
let jobs = [];

async function getData(res) {
    await storage.init();
    email = await storage.getItem('email');
    name = await storage.getItem('name');
    let length = await storage.length();
    if (length > 0) { // thats mean he is logged
        let type = await storage.getItem('type');
        if (type === 'hr') {
            User.findOne({email: email}, function (err, user) {
                for (let i = 0; i < user.jobs.length; i++) {
                    candidates = [];
                    for (let j = 0; j < user.jobs[i].candidates.length; j++) {

                        let candidate = {
                            id: user.jobs[i].candidates[j].id,
                        };
                        candidates.push(candidate)
                    }
                    let job = {
                        candidates:candidates,
                        job_title: user.jobs[i].job_title
                    };
                    jobs.push(job);
                }
                res.render('submissions', {jobs: jobs, logged: 'logged', name: name, hr: 'hr'});
            })
        } else {
            res.redirect('/home')
        }
    } else {
        res.redirect('/home')
    }
}

router.get('/', function (req, res) {
    jobs = [];
    getData(res)
});

module.exports = router;