const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

const userSchema = new Schema({
    
    firstName: {
        type: String,
        required: true
    },

    lastName: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    dateCreated:
    {
        type:Date,
        default:Date.now()
    },

    type: {
        type: String,
        default:"User"
    }

  });

  userSchema.pre("save", function(next) {    //ES5 syntax - because of "this.password" would mean something different if ES6 syntax was used

    //salt - set of randomaly generated characters or strings (generate random text) - parsed with your password - generated together
    //double encryption - password: hello1 | combined: fhjfeyufgerboeerjbrhello1
    //higher the integer value the more complex the algorthim would be - safer - 10 is acceptable
    bcrypt.genSalt(10)
    .then((salt) => {

        bcrypt.hash(this.password, salt)       //refers to user object
        .then((encryptPassword) => {

            this.password = encryptPassword;
            next();

        })
        .catch(err=>console.log(`Error occured when hashing ${err}`))

    })
    .catch(err=>console.log(`Error occured when salting ${err}`))


  });

  const userModel = mongoose.model('User', userSchema);

  module.exports = userModel;