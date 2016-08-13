import Restaurant from '../models/restaurants';
import categoryModelMap from '../search/categoryModelMap';
const modelToCategory = categoryModelMap.modelToCategory;
import IndexDocumentAsTags from '../search/IndexDocumentAsTags'
import searchFunctions from '../search/searchFunctions'
import express from 'express'

export default ({config, db}) => {
    var router = express.Router();
    router.post('/search', function (req, res, next) {
        searchFunctions.searchByCategory('restaurant'
            /**this is a workaround to a strange bug, there should be here modelToCategory[Restaurant]*/,
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
        var newRestaurant = new Restaurant(req.body);
        newRestaurant.save(function (err, savedRestaurant) {
            if (err) {
                next(err);
                return;
            }
            res.json(savedRestaurant);
            IndexDocumentAsTags(savedRestaurant, modelToCategory[Restaurant]);
        });
    });

    router.get('/get/:itemId', function (req, res) {
        Restaurant.find({_id: req.params.itemId}, function (err, newRestaurant) {
            if (err) {
                next(err);
                return;
            }
            res.json(newRestaurant);
        });
    });

    return router;
}
