import Recipe from '../models/recipes';
import express from 'express'

export default ({config, db}) => {
    var router = express.Router();
    router.get('/test', function (req, res, next) {
        var testRecipe = new Recipe({name: 'test_recipe'});
        testRecipe.save(function (err, savedRecipe) {
            if (err) {
                next(err);
                return;
            }
            res.json(savedRecipe);
        });
    });
    router.get('/search', function (req, res) {
        res.json(req.query);
    });
    router.post('/add', function (req, res) {
        var newRecipe = new Recipe(req.body);
        newRecipe.save(function (err, savedRecipe) {
            if (err) {
                next(err);
                return;
            }
            res.json(savedRecipe);
        });
    });
    router.get('/get/:itemId', function (req, res) {
        Recipe.find({_id: req.params.itemId}, function (err, recipe) {
            if (err) {
                next(err);
                return;
            }
            res.json(recipe);
        });
    });
    return router;
}
