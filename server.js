const express = require('express');
const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const session = require('express-session');

require('dotenv').config({ path: 'config/keys.env'});

const generalRoutes = require("./controllers/General");
const userRoutes = require("./controllers/User");
const mediaRoutes = require("./controllers/Movie");
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static("public"));

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use((req,res,next) => {

    if(req.query.method == "PUT") {

        req.method = "PUT";

    } else if(req.query.method == "DELETE") {

        req.method = "DELETE";
    }

    next();
})

app.use(fileUpload());

app.use(session({
    secret: `${process.env.SECRET_KEY}`,
    resave: false,
    saveUninitialized: true
}));

app.use((req,res,next) => {

    res.locals.user = req.session.userInfo;

    res.locals.cart = req.session.cart;
    next();
});

//MAPS EXPRESS TO ALL OUR ROUTER OBJECTS
app.use("/", generalRoutes);
app.use("/user", userRoutes);
app.use("/media", mediaRoutes);

mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
    console.log(`Connected to MongoDB Database`);
})
.catch(err => console.log(`Error occured when connecting to database ${err}`));

const PORT = process.env.PORT;
app.listen(PORT, ()=>{
    console.log("Web Server is running...");
})