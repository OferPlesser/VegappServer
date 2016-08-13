/**
 * Created by ido4848 on 13/08/16.
 */

import SearchTag from '../models/searchTags';
import stopWords from './stopWords';
import categoryModelMap from './categoryModelMap';
const categoryToModel = categoryModelMap.categoryToModel;
var series = require('async-series');


function extractTags(value) {
    if (typeof value != 'string') {
        return;
    }

    var tags = value.split(' ');
    var filteredTags = tags.filter((word)=> {
        return stopWords.indexOf(word) < 0
    });
    return filteredTags.filter(function (elem, pos) {
        return filteredTags.indexOf(elem) == pos;
    })
}

function indexOfJsonOfCategory(array, categoryName) {
    for (var i in array) {
        if (array[i].category == categoryName) {
            return i;
        }
    }
    return -1;
}

function handleNewDocumentTag(document, category, tagName) {
    return new Promise((resolve, reject)=> {
        SearchTag.findOne({word: tagName}, function (err, tag) {
                if (tag) {
                    var categoryIndex = indexOfJsonOfCategory(tag.items, category);
                    if (categoryIndex > 0) {
                        tag.items[categoryIndex].ids.push(document._id);
                    } else {
                        tag.items.push({category: category, ids: [document._id]});
                    }
                    tag.save(resolve, reject);

                } else {
                    var newTag = new SearchTag({word: tagName, items: [{category: category, ids: [document._id]}]});
                    newTag.save(resolve, reject);
                }

            }
        );
    });

}

export default (document, category) => {
    return new Promise((resolve, reject)=> {
        for (var key in categoryToModel[category].schema.tree) {
            try {
                var tags = extractTags(document[key]);
                if (!tags) {
                    reject();
                }
                var addTagPromiseArray = [];
                tags.forEach((tag)=>{
                    addTagPromiseArray.push((done)=> {
                        handleNewDocumentTag(document, category, tag).then(done, done);
                    })
                });
                series(addTagPromiseArray, resolve, reject);
            } catch (err) {

            }

        }

    });
}