import { version } from '../../package.json';
import { Router } from 'express';
import recipes from './recipes';

export default ({ config, db }) => {
	let api = Router();

	// mount the recipes resource
	api.use('/recipes', recipes({ config, db }));

	// perhaps expose some API metadata at the root
	api.get('/', (req, res) => {
		res.json({ version });
	});

	return api;
}
