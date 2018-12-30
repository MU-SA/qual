var express = require('express');
var router = express.Router();
const storage = require('node-persist');

async function removeData() {
    await storage.init();
    await storage.removeItem('email');
    await storage.removeItem('name');
    await storage.removeItem('birthdate');
    await storage.removeItem('phone');
    await storage.removeItem('type');
}


router.get('/', function (req, res) {
    console.log('logout');
    removeData();
    res.redirect('/home')
});

module.exports = router;
