/**
 * Created by ido4848 on 12/08/16.
 */

import XLSX from 'xlsx';
import xlsx from 'node-xlsx';
import Restaurant from '../restaurants';
import categoryModelMap from '../../search/categoryModelMap';
const modelToCategory = categoryModelMap.modelToCategory;
var series = require('async-series');


import IndexDocumentAsTags from '../../search/IndexDocumentAsTags'


const businessFile = __dirname + '/businessList.xlsx';

const restaurantWorksheetName = 'מסעדות לאחר פרסום';
const pizzaWorksheetName = 'פיצות לאחר פרסום';
const sweetsWorksheetName = 'מתוקים לאחר פרסום';
const cateringWorksheetName = 'קייטרינג לאחר פרסם באתר';
const wineryWorksheetName = 'יקבים לאחר פרסום';

const worksheetsToGather = [restaurantWorksheetName,
    pizzaWorksheetName, sweetsWorksheetName,
    cateringWorksheetName, wineryWorksheetName];

const excelKeysToMongoKeys = {
    "סיווג": "classification",
    "שם בית העסק": "title",
    'אזור בארץ': "place",
    'כתובת': 'address',
    "לינק לדף באתר של הויגן פרנדלי": "websiteLink",
    "לינק לדף": "veganFriendlyLink",
    "שעות פתיחה": "openingHours",
    "טלפון בית העסק": "phoneNumber",
    "כשר": "kosher",
    "נכים": "handicappedFriendly",
    "חניה": "parkingSpot",
    "טייקאוואי": "takeAway",
    "משלוחים": "delivery",
    "מייל": "mailAddress"
};


function loadWorksheetFromWorkbook(workBookfilePath, worksheetName) {
    var workbook = XLSX.readFile(workBookfilePath);
    return workbook.Sheets[worksheetName];
}

function parseWorksheet(worksheet) {
    var headers = {};
    var data = [];
    for (var z in worksheet) {
        if (z[0] === '!') continue;
        //parse out the column, row, and value
        var tt = 0;
        for (var i = 0; i < z.length; i++) {
            if (!isNaN(z[i])) {
                tt = i;
                break;
            }
        }
        var col = z.substring(0, tt);
        var row = parseInt(z.substring(tt));
        var value = worksheet[z].v;

        //store header names
        if (row == 1 && value) {
            headers[col] = value;
            continue;
        }

        if (!data[row]) data[row] = {};
        data[row][headers[col]] = value;
    }
    //drop those first two rows which are empty
    data.shift();
    data.shift();
    return data;
}

function addExcelRestaurant(restaurant) {
    return new Promise((resolve, reject)=> {
        var restaurantObj = {};
        for (var key in restaurant) {
            if (restaurant[key]) {
                restaurantObj[excelKeysToMongoKeys[key]] = restaurant[key];
            }

        }
        restaurantObj.location = {
            place: restaurantObj.place,
            address: restaurantObj.address
        };
        var dbRestaurant = new Restaurant(restaurantObj);
        dbRestaurant.save(function (err, savedRestaurant) {
            if (savedRestaurant) {
                IndexDocumentAsTags(savedRestaurant, 'restaurant'
                    /**this is a workaround to a strange bug, there should be here modelToCategory[Restaurant]*/
                    ).then(resolve, reject);
            } else {
                reject();
            }
        });
    });

}

function gatherWorksheet(excelFile, worksheetName) {
    return new Promise((resolve, reject)=> {
        var restaurantsWorksheet = loadWorksheetFromWorkbook(excelFile, worksheetName);
        var restaurants = parseWorksheet(restaurantsWorksheet);
        //restaurants.forEach(addExcelRestaurant);
        var functionArray = [];
        restaurants.forEach((restaurant)=> {
            functionArray.push((done)=> {
                addExcelRestaurant(restaurant).then(done, done);
            });
        });

        series(functionArray, ()=> {
            console.log("workSheet " + worksheetName + " gathered");
            resolve();
        }, reject);
    });

}
function main(done) {
    console.log("starting restaurants Intiation.");
    var gatherFunctionArray = [];
    worksheetsToGather.forEach((worksheetName)=> {
        gatherFunctionArray.push((insideDone)=> {
            gatherWorksheet(businessFile, worksheetName).then(insideDone, insideDone);
        });
    });
    series(gatherFunctionArray, ()=> {
        console.log("restaurants initiated");
        done();
    }, done);
}

export default main;

