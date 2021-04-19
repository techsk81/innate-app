# web322-assign3-5

## Movie and TV Show Rental Service App

This app includes the following modules and functionalities:
###### Customer (User) Registration Module 
- User is added in the database (MongoDB Cloud Service) when registered
- Logged in user can view movies and tv shows

######  Authentication Functionality
- User session is created to maintain user state until the user logs out that destroys the session
- Unsuccessful authentication gives appropriate error message
- Routes are protected to be accessed when users are logged-in

###### Administrator Module & Functionality
- Administrator account is registered in the database (MongoDB Cloud Service)
- Movie & TV Show Functionality - Administrator can: 
  - CREATE
  - ADD
  - EDIT
  - DELETE
  Movies and TV Shows 
  
###### Searching For Movies/TV Shows Module
- Visitors to the app search for movies and tv shows

###### Movie & TV Show Cart Module & Functionality
- Only logged in customers can add movies & tv shows to the cart

## Signing In
### How to Become a Customer
- Sign up to create a new account by clicking on "Sign Up" to get registered
- Log in with the email and password by clicking on "Log In"

### How to log in as an Admin
- Log in by clicking on "Log In" 
- Use the email: admin@innate.com and password: Innate2021 (First letter must be capital) 

## Technologies used
- Node.js
- Express
- Handlebars
- MongoDB
- API: Twilio (SEND GRID)

