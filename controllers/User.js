const express = require('express');
const router = express.Router();

const userModel = require("../models/User");

const bcrypt = require('bcryptjs');  
const isAuthenticated = require("../middleware/auth");
const dashboardLoader = require("../middleware/authorization");

router.get("/register",(req,res)=> {

    res.render("User/register");

});

router.post("/register", (req,res) => {

            const fNameError = [];
            const lNameError = [];
            const emailRError = [];
            const passwordRError = [];
        
            const nameRegex = /^.{5,30}$/;
        
            const passwordRegex = /(?:[A-Z].*[0-9])|(?:[0-9].*[A-Z])/;
        
            const {firstName, lastName, email, password} = req.body;

            if(firstName == "") {

                fNameError.push("You must enter your first name.");
            }
        
    if(!nameRegex.test(firstName)) {

        fNameError.push("First name must be between 5 and 30 charcters long.");

    }

    if(lastName == "") {

        lNameError.push("You must enter your last name.");
    }


    if(email == "") {

        emailRError.push("You must enter an email.");
    }

    if (password == "") {

        passwordRError.push("You must enter a password.");
    }

    if(!passwordRegex.test(password)) {

        passwordRError.push("Password must include at least 1 number and 1 capital letter.");
    }

        //If the user does not enter all the information
        if(fNameError.length > 0 || lNameError.length > 0 || emailRError.length > 0 || passwordRError.length > 0) {

            res.render("User/register", {
                fNameErrorMessage: fNameError,
                lNameErrorMessage: lNameError,
                emailRErrorMessage: emailRError,
                passwordRErrorMessage: passwordRError,
                fNameV: firstName,
                lNameV: lastName,
                emailV: email,
                passwordV: password
            });
        }

        //If the user enters all the data and submit the form
        else
        {
                const newUser = 
                {
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    password: req.body.password
                }

                const user = new userModel(newUser);
                user.save()
                .then(()=>{
                    const sgMail = require('@sendgrid/mail')
                    sgMail.setApiKey(process.env.SEND_GRID_KEY)

                        const msg = {
                        to: `${email}`, // Change to your recipient
                        from: 'shivani_06@hotmail.ca', // Change to your verified sender
                        subject: 'Welcome to Innate!',
                        html: `<strong>Hey ${firstName}! We are pleased to have you join the Innate platform of movies and tv shows!<\strong>
                        <br>
                        <br>Enjoy,<br>
                        Innate Team` ,
                    };
                
                        //Asynchornous operation (we don't know how long this will take to execute)
                        sgMail.send(msg)
                        .then(()=>{
                            console.log('Email Sent!');
                            res.redirect("/");
                        })
                        .catch(err=>{
                            console.log(err);
                        })
                
                })
                .catch((err) => {
                    console.log(`Error while inserting into the data ${err}`);

                    const emailError = [];

                    emailError[1] = "Email is already in use. Please enter another one.";

                    let form = {

                        name: req.body.firstName,
                        email: req.body.email
                    };

                    res.render("User/register", {
                        errors: emailError,
                        form: form
                    });
                
                });
               
        } 
    
});
        

router.get("/login", (req,res) => {

    res.render("User/login");

});

router.post("/login", (req,res) => {

    const emailError = [];
    const passwordError = [];

    const {email, password} = req.body;

    if(email == "") {

        emailError.push("You must enter an email.");
    }

    if(password == "") {

        passwordError.push("You must enter the password.");
    }

    if(emailError.length > 0 || passwordError.length > 0) {

        res.render("User/login", {
            emailErrorMessage: emailError,
            passwordErrorMessage: passwordError,
            emailV: email,
            passwordV: password
        });

    } else {


        userModel.findOne({email: req.body.email})
        .then( user => {
    
            const errors = [];
    
            //email not found
            if(user == null) {
    
                errors.push("Sorry, your email and/or password is incorrect");
                res.render("User/login", {
                    errors
                })
    
            //email is found    
            } else {
    
                bcrypt.compare(req.body.password, user.password)
                .then(isMatched => {
    
                    if(isMatched) {
    
                        //create our session
                        req.session.userInfo = user;
    
                        //dashboardLoader(req, res);
                        res.redirect("userDashboard");
    
                    } else {
    
                        errors.push("Sorry, your email and/or password is incorrect");
                        res.render("User/login", {
                            errors
                        })
    
                    }
                })
                .catch(err=>console.log(`Error: ${err}`));
    
            }
    
        })
        .catch(err=>console.log(`Error: ${err}`));
       
    }


});


router.get("/userDashboard", isAuthenticated, dashboardLoader, (req, res) => {

    res.render("User/userDashboard");

});

router.get("/adminDashboard", isAuthenticated, (req, res) => {

    res.render("User/adminDashboard");

});

router.get("/logout",(req,res)=>{

    req.session.destroy();
    res.redirect("/user/login");
    
});

module.exports = router;