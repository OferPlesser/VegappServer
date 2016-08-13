
import mongoose from 'mongoose'

var searchSessionSchema = mongoose.Schema({
    sessionId: String,
    tags: Array,
    category: String,
    sentResults: Array
});

export default mongoose.model('SearchSession', searchSessionSchema);
