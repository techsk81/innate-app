const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },

    moviesAndTVShows: [
        {
            itemId: String,
            title: String,
            quantity: Number,
            purchasePrice: Number,
            rentalPrice: Number,
            smallPoster: String
            
        }
    ],

    dateCreated: {
        type: Date,
        default: Date.now()
    }
});

const cartModel = mongoose.model('Cart', cartSchema);

module.exports = cartModel;