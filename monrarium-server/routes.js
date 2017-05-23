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
    db.many('select location_id, name from locations where name = ${name}', req.body)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'Erro',
                    data: data,
                    message: 'Erro a inserir localizacao'
                });
        })
        .catch(function (err) {
            db.one('insert into locations(name, rating, distance,time, address)' +
                'values(${name}, ${rating}, ${distance} , ${time} , ${address}) returning location_id',
                req.body)
                .then(function (data) {
                    res.status(200)
                        .json({
                            status: 'Successo',
                            data: data,
                            message: 'Localizacao criada com sucesso'
                        });
                })
        });
}

function getLocation(req, res, next) {
    var location_id = parseInt(req.params.id);
    db.many('select name,rating,distance,time, address from locations where location_id = $1', location_id)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'Sucesso',
                    data: data,
                    message: 'Localizacao retornada'
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
                    status: 'Sucesso',
                    data: 'Rota inserida',
                    message: 'Rota inserida'
                });
        })
        .catch(function (err) {
            return err;
        });
}


function getRoutes(req, res, next) {
    var user_id = parseInt(req.params.id);
    db.many('select r.route_id,l.name,l.rating,l.distance,l.time,l.address from locations l,routes r,route_location rl where r.user_id = $1 and r.route_id = rl.route_id and l.location_id = rl.location_id', user_id)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'Sucesso',
                    data: data,
                    message: 'Rota retornada'
                });
        })
        .catch(function (err) {

            return next(err);
        });
}

