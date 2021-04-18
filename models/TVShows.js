const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tvShowSchema = new Schema({
    
    title: {
        type: String,
        required: true
    },

    synopsis: {
        type: String,
        required: true
    },

    category: {
        type: String,
        required: true
    },

    rating: {
        type: Number,
        required: true
    },

    //small poster, large poster
    smallPoster: {
        type: String,
        required: true
    },

    largePoster: {
        type: String,
        required: true
    },

    rentalPrice: {
        type: Number,
        required: true
    },

    purchasePrice: {
        type: Number,
        required: true
    },

    type: {
        type: String,
        required: true

    },

    featured: {
        type: String,
        required: true
    },

    dateCreated:
    {
        type:Date,
        default:Date.now()
    },

  });

  const tvShowsModel = mongoose.model('TVShow', tvShowSchema);

  module.exports = tvShowsModel;