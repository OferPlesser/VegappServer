/**
 * Created by ido4848 on 12/08/16.
 */

import initiateRestaurants from './initiateRestaurants';
import mongoose from 'mongoose';
import config from '../../config.json';

function connectToDb() {
    return new Promise((resolve, reject)=> {
        var db = mongoose.connection;
        mongoose.connect(config.dbUrl);
        db.on('error', ()=> {
            console.error('connection error');
            reject();
        });
        db.once('open', function () {
            console.log(`Connected to local mongo db`);
            resolve();
        });

    });
}


function main() {
    connectToDb().then(() => {
        initiateRestaurants();
    });
}

main();

