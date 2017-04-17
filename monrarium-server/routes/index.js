var express = require('express');
var cors = require('cors');
var router = express.Router();

router.use(cors())

var dbuser = require('../users');
var dbroute = require('../routes');


router.get('/', function(req, res, next) {
    res.render('index', { title: 'Monrarium Server Api' });
});

//user
router.get('/api/users/:id', dbuser.getUser);
router.post('/api/users/:username',dbuser.loginUser);
router.post('/api/users', dbuser.createUser);
router.put('/api/users/:id', dbuser.updateUser);

//locations
router.post('/api/locations/', dbroute.createLocation);
router.get('/api/locations/:id', dbroute.getLocation);

//routes
router.post('/api/routes/:id', dbroute.createRoute);
router.get('/api/routes/:id', dbroute.getRoutes);

module.exports = router;
