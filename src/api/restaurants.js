import Restaurants from '../models/restaurants';
import express from 'express'

export default ({config, db}) => {
    var router = express.Router();
    router.get('/search', function (req, res) {
        res.json(req.query);
    });
    router.post('/add', function (req, res) {
        var newRestaurant = new Restaurants(req.body);
        newRestaurant.save(function (err, newRestaurant) {
            if (err) {
                next(err);
                return;
            }
            res.json(newRestaurant);
        });
    });
    router.get('/get/:itemId', function (req, res) {
        Restaurants.find({_id: req.params.itemId}, function (err, newRestaurant) {
            if (err) {
                next(err);
                return;
            }
            res.json(newRestaurant);
        });
    });
    return router;
}
