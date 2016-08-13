import mongoose from 'mongoose';

var searchSessionSchema = mongoose.Schema({
    createdAt: {type: Date, expires: 30},
    sessionId: String,
    tags: Array,
    category: String,
    sentResults: Array
});

export default mongoose.model('SearchSession', searchSessionSchema);
