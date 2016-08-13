import Recipe from '../models/recipes';
import categoryModelMap from '../search/categoryModelMap';
const modelToCategory = categoryModelMap.modelToCategory;
import IndexDocumentAsTags from '../search/IndexDocumentAsTags'
import express from 'express'

export default ({config, db}) => {
    var router = express.Router();
    router.post('/add', function (req, res) {
        var newRecipe = new Recipe(req.body);
        newRecipe.save(function (err, savedRecipe) {
            if (err) {
                next(err);
                return;
            }
            res.json(savedRecipe);
            IndexDocumentAsTags(savedRecipe, modelToCategory[Recipe]);
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
