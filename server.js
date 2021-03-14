const express = require('express');
const exphbs  = require('express-handlebars');

const bodyParser = require('body-parser')


const database = require("./model/moviesAndTVShowsDB.js");

const app = express();

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: false }))

require('dotenv').config({ path: 'config/keys.env'});

app.get("/", (req,res) => {

    res.render("index", {
        featuredMovies : database.getAllMovies(),
        featuredTVShows : database.getAllTVShows()
    })
})

app.get("/movies-list", (req,res) => {

    res.render("movieListing", {
        title : "movieListing",
        movies: database.getAllMovies()
    })
})

app.get("/movies-list/:id", (req,res) => {

    res.render("movieDescription",{
        movie : database.getAMovie(req.params.id)
    })

})

app.get("/tvshows-list", (req,res) => {

    res.render("tvShowListing", {
        title : "tvShowListing",
        tvShows : database.getAllTVShows()
    })
})

app.get("/tvshows-list/:id", (req,res) => {

    res.render("tvShowDescription",{
        tvShow : database.getATVShow(req.params.id)
    })

})

app.get("/register", (req,res) => {

    res.render("register");

})

app.get("/sign-in", (req,res) => {

    res.render("sign-in");

})

app.get("/dashboard", (req, res) => {

    res.render("dashboard");
})

app.post("/register", (req,res) => {

    const fNameError = [];
    const lNameError = [];
    const emailRError = [];
    const passwordRError = [];

    const nameRegex = /^.{5,30}$/;

    const passwordRegex = /(?:[A-Z].*[0-9])|(?:[0-9].*[A-Z])/;

    const {firstNameR, lastNameR, emailR, passwordR} = req.body;

    if(firstNameR === "") {

        fNameError.push("You must enter your first name.");
    }

    if(!nameRegex.test(firstNameR)) {

        fNameError.push("First name must be between 5 and 30 charcters long.");

    }

    if(lastNameR === "") {

        lNameError.push("You must enter your last name.");
    }


    if(emailR === "") {

        emailRError.push("You must enter an email.");
    }

    if (passwordR == "") {

        passwordRError.push("You must enter a password.");
    }

    if(!passwordRegex.test(passwordR)) {

        passwordRError.push("Password must include at least 1 number and 1 capital letter.");
    }

    if(fNameError.length > 0 || lNameError.length > 0 || emailRError.length > 0 || passwordRError.length > 0) {

        res.render("register", {
            fNameErrorMessage: fNameError,
            lNameErrorMessage: lNameError,
            emailRErrorMessage: emailRError,
            passwordRErrorMessage: passwordRError,
            fNameV: firstNameR,
            lNameV: lastNameR,
            emailV: emailR,
            passwordV: passwordR
        });

    } else {
        const sgMail = require('@sendgrid/mail')
        sgMail.setApiKey(process.env.SEND_GRID_KEY)
        const msg = {
            to: `${emailR}`, // Change to your recipient
            from: 'shivani_06@hotmail.ca', // Change to your verified sender
            subject: 'Welcome to Innate!',
            html: `<strong>Hey ${firstNameR}! We are pleased to have you join the Innate platform of movies and tv shows!<\strong>
            <br>
            <br>Enjoy,<br>
            Innate Team` ,
        };
        sgMail.send(msg)
        .then(()=>{
            console.log('Email Sent!');
            res.redirect("/dashboard");
        })
        .catch(err=>{
            console.log(err);
        })
    }

})


app.post("/sign-in", (req,res) => {

    const emailError = [];
    const passwordError = [];

    const {email, password} = req.body;

    if(email === "") {

        emailError.push("You must enter an email.");
    }

    if(password === "") {

        passwordError.push("You must enter the password.");
    }

    if(emailError.length > 0 || passwordError.length > 0) {

        res.render("sign-in", {
            emailErrorMessage: emailError,
            passwordErrorMessage: passwordError,
            emailV: email,
            passwordV: password
        });

    } else {

        res.redirect("/");
    }


})



const PORT_NO = 3000;
app.listen(3000, () => {

    console.log(`Web Server listening on PORT NO: ${PORT_NO}`);
})