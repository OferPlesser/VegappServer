import Ingredient from '../models/ingredients';
import categoryModelMap from '../search/categoryModelMap';
const modelToCategory = categoryModelMap.modelToCategory;
import IndexDocumentAsTags from '../search/IndexDocumentAsTags'
import searchFunctions from '../search/searchFunctions'
import express from 'express'

export default ({config, db}) => {
    var router = express.Router();
    router.post('/search', function (req, res, next) {
        searchFunctions.searchByCategory(modelToCategory[Ingredient],
            req.body.sessionId, req.body.tags, req.body.limit).then((searchResults)=> {
            if (!searchResults) {
                res.send(500).end("no search result found");
                next(new Error("no search result found."));
                return;
            } else {
                res.json(searchResults);
            }
        }, ()=>{
            res.send(500).end("no search result found");
        });
    });

    router.post('/add', function (req, res) {
        var newIngredient = new Ingredient(req.body);
        newIngredient.save(function (err, savedIngredient) {
            if (err) {
                next(err);
                return;
            }
            res.json(savedIngredient);
            IndexDocumentAsTags(savedIngredient, modelToCategory[Ingredient]);
        });
    });

    router.get('/get/:itemId', function (req, res) {
        Ingredient.find({_id: req.params.itemId}, function (err, ingredient) {
            if (err) {
                next(err);
                return;
            }
            res.json(ingredient);
        });
    });

    return router;
}
