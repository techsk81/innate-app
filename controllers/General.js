const express = require('express');
const router = express.Router();

const movieModel = require("../models/Movie");

router.get("/", (req,res) => {

    movieModel.find({ featured: true})
    .then((movies) => {

        const filteredMovie = movies.map(movie => {

            return {

                id: movie._id,            
                title: movie.title,
                synopsis: movie.synopsis,
                category: movie.category,
                rating: movie.rating,
                smallPoster: movie.smallPoster,
                largePoster: movie.largePoster,
                rentalPrice: movie.rentalPrice,
                purchasePrice: movie.purchasePrice,
                type: movie.type,
                featured: movie.featured

            }
           
        })

        res.render("General/index", {
            featuredMovies : filteredMovie
        })
    })
    .catch(err=>console.log(`Error :${err}`))

    /*tvShowModel.find({ featured: true})
    .then((tvShows) => {

        const filteredTVShow = tvShows.map(tvShow => {

            return {

               

            }
           
        })

        res.render("General/index", {
            featuredMovies : filteredTVShow
        })
    })
    .catch(err=>console.log(`Error :${err}`));*/
});


module.exports = router;