const express = require('express');
const router = express.Router();

const tvShowsModel = require("../models/Movie");
const cartModel = require("../models/Cart");

const path = require("path");
const session = require('express-session');

const isAuthenticated = require("../middleware/auth");


router.get("/tv-shows-list-admin", isAuthenticated, (req,res) => {

    tvShowsModel.find()
    .then((tvshows) => {

        const filteredTVShowList = tvshows.map(tvshow => {

            return {

                id: tvshow._id,            
                title: tvshow.title,
                synopsis: tvshow.synopsis,
                category: tvshow.category,
                rating: tvshow.rating,
                smallPoster: tvshow.smallPoster,
                largePoster: tvshow.largePoster,
                rentalPrice: tvshow.rentalPrice,
                purchasePrice: tvshow.purchasePrice,
                type: tvshow.type,
                featured: tvshow.featured

            }
           
        })

        res.render("TVShows/tvShowListingAdmin", {
            tvshows : filteredTVShowList
        })
    })
    .catch(err=>console.log(`Error :${err}`))

});

router.post("/tv-shows-list-admin", (req,res) => {

    if(req.body.smallPoster == "all") {

        tvShowsModel.find()
        .then((tvshows) => {
    
            const filteredTVShowList = tvshows.map(tvshow => {
    
                return {
    
                    id: tvshow._id,            
                    title: tvshow.title,
                    synopsis: tvshow.synopsis,
                    category: tvshow.category,
                    rating: tvshow.rating,
                    smallPoster: tvshow.smallPoster,
                    largePoster: tvshow.largePoster,
                    rentalPrice: tvshow.rentalPrice,
                    purchasePrice: tvshow.purchasePrice,
                    type: tvshow.type,
                    featured: tvshow.featured
    
                }
               
            })
    
            res.render("TVShows/tvShowListingAdmin", {
                tvshows : filteredTVShowList
            })
        })
        .catch(err=>console.log(`Error :${err}`));
    } else {
        tvShowsModel.find({smallPoster: req.body.smallPoster})
        .then((tvshows) => {
    
            const filteredTVShowList = tvshows.map(tvshow => {
    
                return {
    
                    id: tvshow._id,            
                    title: tvshow.title,
                    synopsis: tvshow.synopsis,
                    category: tvshow.category,
                    rating: tvshow.rating,
                    smallPoster: tvshow.smallPoster,
                    largePoster: tvshow.largePoster,
                    rentalPrice: tvshow.rentalPrice,
                    purchasePrice: tvshow.purchasePrice,
                    type: tvshow.type,
                    featured: tvshow.featured
    
                }
               
            })
    
            res.render("TVShows/tvShowListingAdmin", {
                tvshows : filteredTVShowList
            })
        })
        .catch(err=>console.log(`Error :${err}`))
    }
});

router.get("/tv-shows-list-user", (req,res) => {

    tvShowsModel.find()
    .then((tvshows) => {

        const filteredTVShowList = tvshows.map(tvshow => {

            return {

                id: tvshow._id,            
                title: tvshow.title,
                synopsis: tvshow.synopsis,
                category: tvshow.category,
                rating: tvshow.rating,
                smallPoster: tvshow.smallPoster,
                largePoster: tvshow.largePoster,
                rentalPrice: tvshow.rentalPrice,
                purchasePrice: tvshow.purchasePrice,
                type: tvshow.type,
                featured: tvshow.featured

            }
           
        })

        res.render("TVShows/tvShowListing", {
            tvshows : filteredTVShowList
        })
    })
    .catch(err=>console.log(`Error :${err}`))

});

//tv shows page
router.get("/tv-shows-list", (req,res) => {

    tvShowsModel.find({type: false})
    .then((tvShows) => {

        const tvShowList = tvShows.map(tvshows => {

            return {

                id: tvshows._id,            
                title: tvshows.title,
                synopsis: tvshows.synopsis,
                category: tvshows.category,
                rating: tvshows.rating,
                smallPoster: tvshows.smallPoster,
                largePoster: tvshows.largePoster,
                rentalPrice: tvshows.rentalPrice,
                purchasePrice: tvshows.purchasePrice,
                type: tvshows.type,
                featured: tvshows.featured

            }
           
        })

        res.render("TVShows/tvShowListing", {
            tvShows: tvShowList
        })
    })
    .catch(err=>console.log(`Error :${err}`))
})

//description
router.get("/tv-shows/:id", (req,res) => {

    movieModel.findById(req.params.id)
    .then((tvshow) => {

        const {_id, title, synopsis, category, rating, smallPoster, largePoster, rentalPrice, purchasePrice, type, featured} = tvshow;

        res.render("TvShows/tvShowDescription", {

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
        res.render("TVShows/tvShowAddForm");

    }  else
    {
        res.redirect("media-list-admin");
    }
});

router.post("/add", isAuthenticated, (req,res) => {

    const newTVShow = {

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

    const tvShow = new tvShowsModel(newTVShow);

    tvShow.save()
    .then((tvshow) => {

        if(req.files.smallPoster.mimetype == "image/jpeg" || req.files.smallPoster.mimetype == "image/png" ||
        req.files.smallPoster.mimetype == "image/gif" || path.parse(req.files.smallPoster.name).ext == "image/jpg" ||
        req.files.largePoster.mimetype == "image/jpeg" || req.files.largePoster.mimetype == "image/png" ||
        req.files.largePoster.mimetype == "image/gif" || path.parse(req.files.largePoster.name).ext == "image/jpg") {

        req.files.smallPoster.name = `small_poster_${tvshow._id}${path.parse(req.files.smallPoster.name).ext}`
        req.files.smallPoster.mv(`public/uploads/${req.files.smallPoster.name}`)

        req.files.largePoster.name = `large_poster_${tvshow._id}${path.parse(req.files.largePoster.name).ext}`
        req.files.largePoster.mv(`public/uploads/${req.files.largePoster.name}`)
        
        .then(() => {
 
            tvShowsModel.updateOne({_id: tvshow._id}, {
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

    tvShowsModel.findById(req.params.id)
    .then((tvshow) => {

        const {_id,synopsis, rating, purchasePrice, rentalPrice, largePoster} = tvshow;

        res.render("TVShows/tvShowEditForm", {

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

    const tvshow = {

        synopsis: req.body.synopsis,
        rating: req.body.rating,
        purchasePrice: req.body.purchasePrice,
        rentalPrice: req.body.rentalPrice,
        largePoster: req.files.largePoster.name
    }

    tvShowsModel.updateOne({_id: req.params.id}, tvshow)
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

    tvShowsModel.find({ title: new RegExp(req.body.searchMovies, 'i') })
    .then((tvshows) => {

        const filteredList = tvshows.map(tvshow => {

            return {

                id: tvshow._id,
                title: tvshow.title,
                synopsis: tvshow.synopsis,
                category: tvshow.category,
                rating: tvshow.rating,
                smallPoster: tvshow.smallPoster,
                largePoster: tvshow.largePoster,
                rentalPrice: tvshow.rentalPrice,
                purchasePrice: tvshow.purchasePrice,
                type: tvshow.type,
                featured: tvshow.featured

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