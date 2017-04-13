var express = require('express');
var router = express.Router();

var dbuser = require('../users');
//var dbroute = require('../routes');


router.get('/', function(req, res, next) {
    res.render('index', { title: 'Monrarium Server Api' });
});

router.get('/api/users/:id', dbuser.getUser);
router.post('/api/users', dbuser.createUser);
router.put('/api/users/:id', dbuser.updateUser);


module.exports = router;
