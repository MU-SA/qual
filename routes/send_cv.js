var express = require('express');
var router = express.Router();
var User = require('../models/User');
const storage = require('node-persist');
var formidable = require('formidable');
var fs = require('fs');

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
        if (type === 'hr') {
            res.redirect('/home')
        } else {
            res.render('send_cv', {logged: "logged", name: name});
        }
    }
}


router.post('/', function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {

        if (files.filetoupload.size > 0) {
            var oldpath = files.filetoupload.path;
            var newpath = '../public/uploaded_files/' + files.filetoupload.name;
            fs.rename(oldpath, newpath, function (err) {
                console.log(err);
                if (err) res.render('send_cv', {errors: [err], logged: logged, name: name});
                else {
                    res.write('File uploaded and moved!');
                    res.end();
                }
            });
        } else {
            res.render('send_cv', {errors: [{code: 'no file chosen'}], logged: logged, name: name});
        }
    });
});

router.get('/', function (req, res) {
    console.log(req.query);
    check(res, req)
});

module.exports = router;