import mongoose from 'mongoose'

var restaurantSchema = mongoose.Schema({
    title: String,
    location: {
        place: String,
        coordinates: String,
        address: String
    },
    websiteLink: String,
    veganFriendlyLink: String,
    openingHours: String,
    phoneNumber: String,
    mailAddress: String,
    kosher: String,
    handicappedFriendly: String,
    parkingSpot: String,
    takeAway: String,
    delivery: String,
    classification: String
});

export default mongoose.model('Restaurant', restaurantSchema);
