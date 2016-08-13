import mongoose from 'mongoose'

var searchTagSchema = mongoose.Schema({
    word: {type:String, index: {unique: true, dropDups: true}, unique: true},
    items: Array
    /**
     items:
     [
     {
     category:'recipes',
     ids:[]
     },
     {
     category:'resturants',
     ids:[]
     },...
     ]
     */
});

export default mongoose.model('SearchTag', searchTagSchema);
