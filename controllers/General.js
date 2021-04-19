const express = require('express');
const router = express.Router();

const movieModel = require("../models/Movie");

router.get("/", (req,res) => {

    movieModel.find({ featured: true})
    .then((moviesandTVShows) => {

        const filteredMovieAndTVShows = moviesandTVShows.map(media => {

            return {

                id: media._id,            
                title: media.title,
                synopsis: media.synopsis,
                category: media.category,
                rating: media.rating,
                smallPoster: media.smallPoster,
                largePoster: media.largePoster,
                rentalPrice: media.rentalPrice,
                purchasePrice: media.purchasePrice,
                type: media.type,
                featured: media.featured

            }
           
        })

        res.render("General/index", {
            featuredMoviesandTVShows: filteredMovieAndTVShows
        })
    })
    .catch(err=>console.log(`Error occured when pulling featured movies and tv shows:${err}`))

});


module.exports = router;