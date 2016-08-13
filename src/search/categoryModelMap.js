/**
 * Created by ido4848 on 13/08/16.
 */

import Recipe from '../models/recipes';
import Restaurant from '../models/restaurants';
import Ingredient from '../models/ingredients';

function swap(json) {
    var ret = {};
    for (var key in json) {
        ret[json[key]] = key;
    }
    return ret;
}

const categoryToModel = {
    'recipe': Recipe,
    'restaurant': Restaurant,
    'ingredient': Ingredient
};

const modelToCategory = {
    Recipe: 'recipe',
    Restaurant:'restaurant',
    Ingredient:'ingredient'
};

export default {
    categoryToModel, modelToCategory
};

