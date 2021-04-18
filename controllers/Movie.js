const express = require('express');
const router = express.Router();

const movieModel = require("../models/Movie");
const cartModel = require("../models/Cart");

const path = require("path");

const isAuthenticated = require("../middleware/auth");


router.get("/media-list-admin", isAuthenticated, (req,res) => {

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

        res.render("Media/movieListingAdmin", {
            movies : filteredMovieList
        })
    })
    .catch(err=>console.log(`Error :${err}`))

});

router.post("/media-list-admin", (req,res) => {

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
    
            res.render("Media/movieListingAdmin", {
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
    
            res.render("Media/movieListingAdmin", {
                movies : filteredMovieList
            })
        })
        .catch(err=>console.log(`Error :${err}`))
    }
});

router.get("/media-list-user", (req,res) => {

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

        res.render("Media/movieListing", {
            movies: filteredMovieList
        })
    })
    .catch(err=>console.log(`Error :${err}`))

});

//movies page
router.get("/movies-list", (req,res) => {

    movieModel.find({type: true})
    .then((movies) => {

        const movieList = movies.map(movie => {

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

        res.render("Media/movieListing", {
            movies: movieList
        })
    })
    .catch(err=>console.log(`Error :${err}`))
})

//description
router.get("/media-list/:id", (req,res) => {

    movieModel.findById(req.params.id)
    .then((movie) => {

        const {_id, title, synopsis, category, rating, smallPoster, largePoster, rentalPrice, purchasePrice, type, featured} = movie;

        res.render("Media/movieDescription", {

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

//add
router.get("/add", isAuthenticated, (req,res) => {

    if (req.session.userInfo.type == "Admin") {
        res.render("Media/movieAddForm");

    }  else
    {
        res.redirect("media-list-admin");
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

        if(req.files.smallPoster.mimetype == "image/jpeg" || req.files.smallPoster.mimetype == "image/png" ||
        req.files.smallPoster.mimetype == "image/gif" || path.parse(req.files.smallPoster.name).ext == "image/jpg" ||
        req.files.largePoster.mimetype == "image/jpeg" || req.files.largePoster.mimetype == "image/png" ||
        req.files.largePoster.mimetype == "image/gif" || path.parse(req.files.largePoster.name).ext == "image/jpg") {
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
                res.redirect(`/Media/media-list-admin`);
            })
            .catch(err=>console.log(`Error while inserting into the data ${err}`));

         })

        } else {

            console.log(`Error while uploading image: not an image`);
        }

    })
    .catch(err=>console.log(`Error while inserting into the data ${err}`));

})

//synopsis, price, small banner and large banner
router.get("/edit/:id", (req, res) => {

    movieModel.findById(req.params.id)
    .then((movie) => {

        const {_id,synopsis, rating, purchasePrice, rentalPrice, largePoster} = movie;

        res.render("Media/movieEditForm", {

            _id,
            synopsis,
            rating,
            purchasePrice,
            rentalPrice,
            largePoster
        })

    })
    .catch(err=>console.log(`Error occurred when pulling from the database : ${err}`));    
})

router.put("/update/:id", (req,res) => {

    const movie = {

        synopsis: req.body.synopsis,
        rating: req.body.rating,
        purchasePrice: req.body.purchasePrice,
        rentalPrice: req.body.rentalPrice,
        largePoster: req.files.largePoster.name
    }

    movieModel.updateOne({_id: req.params.id}, movie)
    .then(() => {

        res.redirect("/Media/media-list-admin");

    })
    .catch(err=>console.log(`Error occurred when updating data from the database : ${err}`));    

});

//router to delete user
router.delete("/delete/:id", isAuthenticated, (req,res) => {

    movieModel.deleteOne({_id: req.params.id})
    .then(() => {
        res.redirect("/Media/media-list-admin");

    })
    .catch(err=>console.log(`Error occurred when deleting data from the database : ${err}`));    

});

router.post("/search", (req,res) => {

    movieModel.find({ title: new RegExp(req.body.searchMovies, 'i') })
    .then((movies) => {

        const filteredList = movies.map(movie => {

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
        });

        const searchItems = [];

        for(i = 0; i < item.filteredList; i++) {
            searchItems.push(item[i].title);
        }

        res.render("Media/movieListing", {
            data: filteredList,
            searchItems
        })
    })
    .catch((err) => {console.log(`Error happened when pulling from the database: ${err}`);})
});

router.post("/add-to-cart", isAuthenticated, (req,res) => {

    const {_id, title, quantity, purchasePrice, rentalPrice, smallPoster} = req.body;

    let userId = req.session.userInfo._id;

    cartModel.findById(userId)
    .then( cart => {

        if(cart) {

            let index = cart.moviesAndTVShows.findIndex(m => m._id == _id);

            if(index > -1) {

                let item = cart.moviesAndTVShows[index];
                item.quantity = quantity;
                cart.moviesAndTVShows[index] = item;
            } else {

                cart.moviesAndTVShows.push({ _id, title, quantity, purchasePrice, rentalPrice, smallPoster});
            }

            cartModel.updateOne({userId: req.session.userInfo._id}, {

                moviesAndTVShows: [{ _id, title, quantity, purchasePrice, rentalPrice, smallPoster}]

            })
            .then(() => {

    
                res.redirect("User/cart");
        
            })
            .catch(err=>console.log(`Error occurred when updating cart: ${err}`)); 


        } else {

        const mediaCart = {

            userId,
            moviesAndTVShows: [{ _id, title, quantity, purchasePrice, rentalPrice, smallPoster}]
        }; 

        const cart2 = new cartModel(mediaCart);
        const purchaseOrderTotal = mediaCart.moviesAndTVShows[0].purchasePrice * mediaCart.moviesAndTVShows[0].quantity;
        const rentalOrderTotal = mediaCart.moviesAndTVShows[0].rentalPrice * mediaCart.moviesAndTVShows[0].quantity;

        cart2.save()
        .then(() => {

            res.render("User/cart", {

                userId,
                moviesAndTVShows: [{ _id, title, quantity, purchasePrice, rentalPrice, smallPoster}],
                purchaseOrderTotal,
                rentalOrderTotal
            })
           

        })
        .catch(err=>console.log(`Error occurred when updating cart: ${err}`)); 

        }
    })
    .catch(err=>console.log(`Error occurred when updating cart: ${err}`)); 


})
module.exports = router;