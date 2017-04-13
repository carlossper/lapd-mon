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
/*    getAllPuppies: getAllPuppies,
    getSinglePuppy: getSinglePuppy,
    createPuppy: createPuppy,
    updatePuppy: updatePuppy,
    removePuppy: removePuppy
    */
};