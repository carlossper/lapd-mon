var promise = require('bluebird');

var options = {
    // Initialization Options
    promiseLib: promise
};

var pgp = require('pg-promise')(options);
pgp.pg.defaults.ssl = true;
var connectionString = 'postgres://gmyivgapduzmkl:7c23fe62bde422e5d21f653b5e61f9e8742f83b4055ce93563a4e5f34e54c261@ec2-54-75-239-190.eu-west-1.compute.amazonaws.com:5432/dd0q3mdpesk3p2';
var db = pgp(connectionString);

// add query functions

module.exports = {
    getUser: getUser,
    createUser: createUser,
    updateUser: updateUser
};

function getUser(req, res, next) {
    var user_id = parseInt(req.params.id);
    db.many('select name,username from users where user_id = $1', user_id)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Retrieved user'
                });
        })
        .catch(function (err) {

            return next(err);
        });
}


function createUser(req, res, next) {
    db.one('insert into users(name, username, password)' +
        'values(${name}, ${username}, ${password}) returning user_id',
        req.body)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Inserted user'
                    });
                })
        .catch(function (err) {
            return next(err);
    });
}

function updateUser(req, res, next) {
    db.none('update users set name=$1, username=$2, password=$3 where user_id=$4',
        [req.body.name, req.body.username, req.body.password,parseInt(req.params.id)])
        .then(function () {
            res.status(200)
                .json({
                    status: 'success',
                    message: 'Updated user'
                });
        })
        .catch(function (err) {
            return next(err);
        });
}