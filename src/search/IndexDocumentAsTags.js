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
    for (var i = 0; i < array.length; i++) {
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
                    if (categoryIndex >= 0) {
                        if (tag.items[categoryIndex].ids.indexOf(document._id) < 0) {
                            tag.items[categoryIndex].ids.push(document._id);
                        }
                    } else {
                        tag.items.push({category: category, ids: [document._id]});
                    }
                    tag.save(function (err, tag) {
                        console.log(tagName);
                        console.log(tag);
                        console.log(tag.items[0].ids);
                        console.log(typeof tag.items[0].ids);
                        return resolve();
                    }, reject);

                } else {
                    var newTag = new SearchTag({word: tagName, items: [{category: category, ids: [document._id]}]});
                    newTag.save(resolve, reject);
                }

            }
        );
    });

}

export default function main(document, category){
    return new Promise((resolve, reject)=> {

        var addTagByKeyPromiseArray = [];
        Object.keys(categoryToModel[category].schema.tree).forEach((key)=>{
            addTagByKeyPromiseArray.push((done)=> {
                try {
                    if (key == "id" || key == "_id") {
                        return done();
                    }
                    var tags = extractTags(document[key]);
                    console.log(key);
                    console.log(tags);
                    if (!tags) {
                        return done();
                    }
                    var addTagPromiseArray = [];
                    tags.forEach((tag)=> {
                        addTagPromiseArray.push((insideDone)=> {
                            handleNewDocumentTag(document, category, tag).then(insideDone, insideDone);
                        })
                    });
                    series(addTagPromiseArray, done, done);
                } catch (err) {
                    return reject();
                }
            });
        });
        series(addTagByKeyPromiseArray, resolve, reject);

    });
}