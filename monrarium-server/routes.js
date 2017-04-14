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
    createLocation: createLocation,
    getLocation: getLocation,
    createRoute: createRoute,
    getRoutes: getRoutes
};

function createLocation(req, res, next) {
    db.many('select latitude,longitude from locations where latitude = ${latitude} and longitude = ${longitude}', req.body)
        .then(function (data) {
            res.status(300)
                .json({
                    status: 'Failed',
                    data: 'Location already exists',
                    message: 'Inserting location failed'
                });
        })
        .catch(function (err) {
            db.one('insert into locations(name, latitude, longitude)' +
                'values(${name}, ${latitude}, ${longitude}) returning location_id',
                req.body)
                .then(function (data) {
                    res.status(200)
                        .json({
                            status: 'Success',
                            data: data,
                            message: 'Location created successfully'
                        });
                })
        });
}

function getLocation(req, res, next) {
    var location_id = parseInt(req.params.id);
    db.many('select name,latitude,longitude from locations where location_id = $1', location_id)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Retrieved location'
                });
        })
        .catch(function (err) {

            return next(err);
        });


}

function createRoute(req, res, next) {
    var user_id = parseInt(req.params.id);
    db.one('insert into routes(user_id)' +
        'values($1) returning route_id',
        user_id)
        .then(function (data) {
            var route_id = parseInt(data.route_id);
            for( var i = 0; i < req.body.location_id.length; i++) {
                var location_id = parseInt(req.body.location_id[i]);
                db.none('insert into route_location(route_id,location_id)' +
                    'values($1,$2)',
                    [route_id,location_id])
            }
            res.status(200)
                .json({
                    status: 'success',
                    data: 'Route inserted',
                    message: 'Inserted'
                });
        })
        .catch(function (err) {
            return err;
        });
}


function getRoutes(req, res, next) {
    var user_id = parseInt(req.params.id);
    db.many('select r.route_id,l.name,l.latitude,l.longitude from locations l,routes r,route_location rl where r.user_id = $1 and r.route_id = rl.route_id and l.location_id = rl.location_id', user_id)
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

