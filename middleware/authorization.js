const movieModel = require("../models/Movie");

const dashboardLoader = (req,res,next) => {

    if(req.session.userInfo.type == "Admin") {

        movieModel.find()
    .then((movies) => {

        const filteredMovieList = movies.map(movie => {

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

        res.render("User/adminDashboard", {
            movies : filteredMovieList
        })
    })
    .catch(err=>console.log(`Error :${err}`));


    } else {

        res.render("User/userDashboard");
    }
}

module.exports = dashboardLoader;