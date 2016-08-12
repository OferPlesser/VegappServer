import http from 'http';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import initializeDb from './db';
import middleware from './middleware';
import api from './api';
import config from './config.json';

let app = express();
app.server = http.createServer(app);

// 3rd party middleware
app.use(cors({
	exposedHeaders: config.corsHeaders
}));

app.use(bodyParser.json({
	limit : config.bodyLimit
}));



// connect to db
initializeDb( db => {

	// internal middleware
	app.use(middleware({ config, db }));

	// api router
	app.use('/api', api({ config, db }));
	app.use(function logErrors(err, req, res, next) {
		console.error(err.stack);
		next(err);
	});
	app.use(function clientErrorHandler(err, req, res, next) {
		if (req.xhr) {
			res.status(500).send({ error: 'Something failed!' });
		} else {
			next(err);
		}
	});
	app.use(function errorHandler(err, req, res, next) {
		res.status(500);
		res.render('error', { error: err });
	});

	app.server.listen(process.env.PORT || config.port);

	console.log(`Started on port ${app.server.address().port}`);
});

export default app;
