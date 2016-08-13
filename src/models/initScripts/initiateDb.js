/**
 * Created by ido4848 on 12/08/16.
 */

import initiateRestaurants from './initiateRestaurants';
import initiateIngredients from './initiateIngredients';
import mongoose from 'mongoose';
import config from '../../config.json';
var series = require('async-series');

function connectToDb(done) {
    var db = mongoose.connection;
    mongoose.connect(config.dbUrl);
    db.on('error', ()=> {
        console.error('connection error');
        done(new Error());
    });
    db.once('open', function () {
        console.log(`Connected to local mongo db`);
        done();
    });

}


function main() {
    var funcArray = [connectToDb, initiateIngredients, initiateRestaurants];
    series(funcArray, function () {
        console.log("finished initiating db");
        return;
    }, function (err) {
        console.log("error during initiating db");
    });
}

main();

