const express = require('express');

// We import our controllers
const mainController = require('./controllers/mainController');
const userController = require('./controllers/userController');

const mainRouter = express.Router();

// We set up the routes
mainRouter.get('/', mainController.homePage);
mainRouter.get('/login', userController.loginPage);
mainRouter.post('/login', userController.login);
mainRouter.get('/logout', userController.logout);
mainRouter.get('/register', userController.registerPage);
mainRouter.post('/register', userController.register);
mainRouter.get('/profile', userController.profilePage);
mainRouter.get('/profile/edit', userController.editProfilePage);
mainRouter.post('/profile/edit', userController.editProfile);

// We export the router
module.exports = mainRouter;
