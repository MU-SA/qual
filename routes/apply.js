var express = require('express');
var router = express.Router();
var User = require('../models/User');
const storage = require('node-persist');
var formidable = require('formidable');
var mongo = require('mongodb');
var fs = require('fs');

const multer = require("multer");
const upload = multer({
    dest: "/path/to/temporary/directory/to/store/uploaded/files"
    // you might also want to set some limits: https://github.com/expressjs/multer#limits
});

let logged = true;
let name = "";
let type = "";
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

        let user_id = new mongo.ObjectId(req.query.user_id.replace('/', ''));
        let job_id = new mongo.ObjectId(req.query.id.replace('/', ''));
        if (type === 'hr') {
            res.redirect('/home')
        } else {
            User.findOne({_id: user_id}, function (err, user) {
                if (err)
                    throw err;
                for (let i = 0; i < user.jobs.length; i++) {

                    if ('' + new mongo.ObjectId(user.jobs[i]._id) === '' + job_id) {
                        let candidate = {
                            id: email,
                            approved:false
                        };
                        user.jobs[i].candidates.push(candidate);
                        user.save();
                        res.redirect('/home');
                    }
                }
                res.end('job not found')
            })
        }
    }
}

router.get('/', function (req, res) {
    check(res, req)
});

module.exports = router;