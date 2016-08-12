import mongoose from 'mongoose';
import config from './config.json';

export default callback => {
	// connect to a database if needed, the pass it to `callback`:
	var db = mongoose.connection;
	mongoose.connect(config.dbUrl);
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function() {
		console.log(`Connected to local mongo db`);
	});
	callback(db);
}
