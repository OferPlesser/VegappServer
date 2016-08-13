/**
 * Created by ido4848 on 13/08/16.
 */

import SearchSession from '../models/searchSessions';
import SearchTags from '../models/searchTags';
import uuid from 'node-uuid';
import categoryModelMap from './categoryModelMap';
const categoryToModel = categoryModelMap.categoryToModel;

const DEFAULT_LIMIT = 10;

function searchByCategory_aux(category, tags) {
    return new Promise((resolving, reject) => {
        var gettingItemsPromises = [];
        for (var i = 0; i < tags.length; i++) {
            var tag = tags[i];
            var p = new Promise((resolve, reject) => {
                SearchTags.findOne({word: tag}, function (err, dbTag) {
                    if (dbTag) {
                        return resolve(dbTag);
                    } else {
                       return reject();
                    }
                })
            });
            gettingItemsPromises.push(p);
        }
        Promise.all(gettingItemsPromises).then(itemsList => {
            var gettingSearchResultsPromises = [];

            for (var i = 0; i < itemsList.length; i++) {
                var items = itemsList[i];
                for (var j = 0; j < items.items.length; j++) {
                    var categoryList = items.items[j];
                    if (categoryList.category == category) {
                        var ids = categoryList.ids;
                        for (var k = 0; k < ids.length; k++) {
                            var id = ids[k];
                            var p = new Promise((resolve, reject) => {
                                categoryToModel[category].findOne({_id: id}, (err, item)=> {
                                    if (item) {
                                        return resolve(item);
                                    }
                                });
                            });
                            gettingSearchResultsPromises.push(p);
                        }
                    }
                }
            }
            Promise.all(gettingSearchResultsPromises).then((searchResults)=> {
                return resolving(searchResults);
            });
        }, () => {
            return reject();
        });
    });
}

function searchByCategory(category, sessionId, tags, limit) {
    if(!limit){
        limit = DEFAULT_LIMIT;
    }
    return new Promise((resolve, reject) => {
        if (sessionId) {
            SearchSession.findOne({sessionId: sessionId}, function (err, searchSession) {
                if (err) {
                    if (!err.err) {
                        err.err = true;
                        reject(err);
                    }
                }
                searchByCategory_aux(searchSession.category, searchSession.tags).then((searchResults)=> {
                    var unsentSearchResults = searchResults.filter((searchResult)=> {
                        return searchSession.sentResults.indexOf(searchResult._id) < 0;
                    });
                    var resultToBeSend = unsentSearchResults.slice(0, limit);
                    for (var i = 0; i < resultToBeSend.length; i++) {
                        searchSession.sentResults.push(resultToBeSend[i]._id);
                    }
                    return resolve(resultToBeSend);
                }, ()=> {
                   return reject();
                });
            })
        } else {
            searchByCategory_aux(category, tags).then((searchResults)=> {
                if (!searchResults) {
                    return reject();
                }
                var resultToBeSend = searchResults.slice(0, limit);
                var newSession = {sessionId: uuid.v1(), category: category, tags: tags, sentResults: []};
                for (var i = 0; i < resultToBeSend.length; i++) {
                    newSession.sentResults.push(resultToBeSend[i]._id);
                }
                var newSessionObject = new SearchSession(newSession);
                newSessionObject.save();
                resolve({sessionId: newSessionObject.sessionId, searchResults: resultToBeSend});
            }, ()=> {
                return reject();
            });
        }


    });
}

var searchFunctions = {
    searchByCategory
};

export default searchFunctions;
