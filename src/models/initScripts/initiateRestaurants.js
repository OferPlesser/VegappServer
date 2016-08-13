/**
 * Created by ido4848 on 12/08/16.
 */

import XLSX from 'xlsx';
import xlsx from 'node-xlsx';
import Restaurant from '../restaurants';
import categoryModelMap from '../../search/categoryModelMap';
const modelToCategory = categoryModelMap.modelToCategory;

import IndexDocumentAsTags from '../../search/IndexDocumentAsTags'


const businessFile = __dirname + '/businessList.xlsx';
const restaurantWorksheetName = 'מסעדות לאחר פרסום';

const excelKeysToMongoKeys = {
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
    var restaurantObj = {};
    for (var key in restaurant) {
        restaurantObj[excelKeysToMongoKeys[key]] = restaurant[key];
    }
    restaurantObj.location = {
        place: restaurantObj.place,
        address: restaurantObj.address
    };
    var dbRestaurant = new Restaurant(restaurantObj);
    dbRestaurant.save(function(err, savedRestaurant){
        if(savedRestaurant){
            IndexDocumentAsTags(savedRestaurant, modelToCategory[Restaurant]);
        }
    });
}

function main() {
    var restaurantsWorksheet = loadWorksheetFromWorkbook(businessFile, restaurantWorksheetName);
    var restaurants = parseWorksheet(restaurantsWorksheet);
    restaurants.forEach(addExcelRestaurant);
}

export default main;

