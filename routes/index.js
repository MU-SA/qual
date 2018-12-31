var express = require('express');
var router = express.Router();
const storage = require('node-persist');
var User = require('../models/User');

let logged = true;
let email = '';

async function getData(res) {
    await storage.init();
    let length = await storage.length();
    console.log(length);
    if (length === 0)
        logged = false;
    else
        logged = true;

    if (logged) {
        let type = await storage.getItem('type');
        let name = ' ' + await storage.getItem('name');
        email = await storage.getItem('email');
        if (type === 'hr') {
            res.render('logged', {name: name, logged: 'Logged', Desc: 'IA Project', hr: 'hr'});

        } else {
            User.find({}, function (err, ress) {
                let jobs = [];
                for (let i = 0; i < ress.length; i++) {
                    for (let j = 0; j < ress[i].jobs.length; j++) {
                        let job = {
                            company_name: ress[i].jobs[j].company_name,
                            job_loc: ress[i].jobs[j].job_loc,
                            job_title: ress[i].jobs[j].job_title,
                            job_desc: ress[i].jobs[j].job_desc,
                            user_id: ress[i]._id,
                            _id: ress[i].jobs[j]._id
                        };
                        let found = false;
                        for (let k = 0; k < ress[i].jobs[j].candidates.length; k++) {
                            if (''+ress[i].jobs[j].candidates[k].id === '' + email) {
                                found = true
                            }
                        }
                        job.applied = found;
                        jobs.push(job)


                    }
                }
                res.render('logged', {name: name, logged: 'Logged', jobs: jobs});

            })
        }
    } else {
        console.log('not logged');
        res.render('index', {name: '', logged: null, Desc: 'IA Project'});
    }
}

/* GET home page. */
router.get('/', function (req, res, next) {
    getData(res)

});

module.exports = router;
