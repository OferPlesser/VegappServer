/**
 * Created by ido4848 on 13/08/16.
 */

import Recipe from '../models/recipes';
import Restaurant from '../models/restaurants';

function swap(json) {
    var ret = {};
    for (var key in json) {
        ret[json[key]] = key;
    }
    return ret;
}

var categoryToModel = {
    'recipe': Recipe,
    'restaurant': Restaurant
};

var modelToCategory = swap(categoryToModel);

export default {
    categoryToModel, modelToCategory
};

