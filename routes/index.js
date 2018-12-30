var express = require('express');
var router = express.Router();
const storage = require('node-persist');

let logged = true;

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
        if (type === 'hr') {
            res.render('logged', {name: name, logged: 'Logged', Desc: 'IA Project', hr: 'hr'});

        } else {
            res.render('logged', {name: name, logged: 'Logged', Desc: 'IA Project'});
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
