const express = require('express');
const router = express.Router();

const movieModel = require("../models/Movie");
const path = require("path");

const isAuthenticated = require("../middleware/auth");


router.get("/movies-list-admin", (req,res) => {

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

        res.render("Movies/movieListingAdmin", {
            movies : filteredMovieList
        })
    })
    .catch(err=>console.log(`Error :${err}`))

});

router.post("/movies-list-admin", (req,res) => {

    if(req.body.smallPoster == "all") {

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
    
            res.render("Movies/movieListingAdmin", {
                movies : filteredMovieList
            })
        })
        .catch(err=>console.log(`Error :${err}`));
    } else {
        movieModel.find({smallPoster: req.body.smallPoster})
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
    
            res.render("Movies/movieListingAdmin", {
                movies : filteredMovieList
            })
        })
        .catch(err=>console.log(`Error :${err}`))
    }
});

//admin
router.get("/movies-list-user", (req,res) => {

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

        res.render("Movies/movieListing", {
            movies : filteredMovieList
        })
    })
    .catch(err=>console.log(`Error :${err}`))

});


//description
router.get("/movies-list/:id", (req,res) => {

    movieModel.findById(req.params.id)
    .then((movie) => {

        const {_id, title, synopsis, category, rating, smallPoster, largePoster, rentalPrice, purchasePrice, type, featured} = movie;

        res.render("Movies/movieDescription", {

            _id, 
            title, 
            synopsis, 
            category, 
            rating, 
            smallPoster, 
            largePoster, 
            rentalPrice, 
            purchasePrice, 
            type, 
            featured
        })
    })
    .catch(err=>console.log(`Error: ${err}`));

});

router.get("/add", isAuthenticated, (req,res) => {

    if (req.session.userInfo.type == "Admin") {
        res.render("Movies/movieAddForm");

    }  else
    {
        res.redirect("movies-list-admin");
    }
});

router.post("/add", isAuthenticated, (req,res) => {

    const newMovie = {

        title: req.body.title,
        synopsis: req.body.synopsis,
        category: req.body.category,
        rating: req.body.rating,
        smallPoster: req.files.smallPoster.name,
        largePoster: req.files.largePoster.name,
        rentalPrice: req.body.rentalPrice,
        purchasePrice: req.body.purchasePrice,
        type: req.body.type,
        featured: req.body.featured
    }

    const movie = new movieModel(newMovie);

    movie.save()
    .then((movie) => {

        //small poster
        req.files.smallPoster.name = `small_poster_${movie._id}${path.parse(req.files.smallPoster.name).ext}`
        req.files.smallPoster.mv(`public/uploads/${req.files.smallPoster.name}`)

        req.files.largePoster.name = `large_poster_${movie._id}${path.parse(req.files.largePoster.name).ext}`
        req.files.largePoster.mv(`public/uploads/${req.files.largePoster.name}`)
        
        .then(() => {
 
            movieModel.updateOne({_id: movie._id}, {
                smallPoster: req.files.smallPoster.name,
                largePoster: req.files.largePoster.name
            })
            .then(() => {
                //res.redirect(`/Movies/movies-list/${movie._id}`);
                res.redirect(`/Movies/movies-list-admin`);
            })
            .catch(err=>console.log(`Error while inserting into the data ${err}`));

         })

    })
    .catch(err=>console.log(`Error while inserting into the data ${err}`));

})

//synopsis, price, small banner and large banner
router.get("/edit/:id", (req, res) => {

    movieModel.findById(req.params.id)
    .then((movie) => {

        const {_id,synopsis, purchasePrice, rentalPrice, smallPoster, largePoster} = movie;

        res.render("Movies/movieEditForm", {

            _id,
            synopsis,
            purchasePrice,
            rentalPrice,
            smallPoster,
            largePoster
        })

    })
    .catch(err=>console.log(`Error occurred when pulling from the database : ${err}`));    
})

router.put("/update/:id", (req,res) => {

    const movie = {

        synopsis: req.body.synopsis,
        purchasePrice: req.body.purchasePrice,
        rentalPrice: req.body.rentalPrice,
        smallPoster: req.body.smallPoster,
        largePoster: req.body.largePoster
    }

    movieModel.updateOne({_id: req.params.id}, movie)
    .then(() => {

        req.files.smallPoster.name = `small_poster_${movie._id}${path.parse(req.files.smallPoster.name).ext}`
        req.files.smallPoster.mv(`public/uploads/${req.files.smallPoster.name}`)

        req.files.largePoster.name = `large_poster_${movie._id}${path.parse(req.files.largePoster.name).ext}`
        req.files.largePoster.mv(`public/uploads/${req.files.largePoster.name}`)

        .then(() => {
 
            movieModel.updateOne({_id: movie._id}, {
                smallPoster: req.files.smallPoster.name,
                largePoster: req.files.largePoster.name
            })
            .then(() => {
                res.redirect("/Movies/movies-list-admin");

            })
            .catch(err=>console.log(`Error while inserting into the data ${err}`));

         })
       //res.redirect("/Movies/movies-list-admin");
       //res.redirect("/User/adminDashboard");
    })
    .catch(err=>console.log(`Error occurred when updating data from the database : ${err}`));    

});

//router to delete user
router.delete("/delete/:id", isAuthenticated, (req,res) => {

    movieModel.deleteOne({_id: req.params.id})
    .then(() => {
        res.redirect("/Movies/movies-list-admin");
        //res.redirect("/User/adminDashboard");

    })
    .catch(err=>console.log(`Error occurred when deleting data from the database : ${err}`));    

});

module.exports = router;