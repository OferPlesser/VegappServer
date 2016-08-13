import mongoose from 'mongoose'

var ingredientSchema = mongoose.Schema({
    code: String,
    name: String,
    isVegan: String
});

export default mongoose.model('Ingredient', ingredientSchema);
