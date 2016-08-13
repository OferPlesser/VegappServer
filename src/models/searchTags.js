import mongoose from 'mongoose'

var searchTagSchema = mongoose.Schema({
    word: String,
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
