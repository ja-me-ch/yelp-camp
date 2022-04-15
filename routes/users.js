const express = require('express');
const router = express.Router();
const passport = require('passport');

const usersController = require('../controllers/users')

const catchAsync = require('../utils/catchAsync');

router.route('/register')
    .get(usersController.renderRegister)
    .post(catchAsync(usersController.createUser));

router.route('/login')
    .get(usersController.renderLogin)
    .post(
        passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }),
        usersController.loginUser
    );

router.get('/logout', usersController.logoutUser);

module.exports = router;