// our example model is just an Array

import mongoose from 'mongoose'

var recipeSchema = mongoose.Schema({
    title: String,
    description: String,
    websiteLink: String,
    veganFriendlyLink: String,
    openingHours: String,
    phoneNumber: String,
    kosherFlag: Boolean,
    handicappedFriendlyFlag: Boolean,
    parkingSpotFlag: Boolean,
    takeAwayFlag: Boolean,
    deliveryFlag: Boolean
});

export default mongoose.model('Recipe', recipeSchema);
