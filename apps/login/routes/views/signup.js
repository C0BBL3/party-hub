/*
Creates the endpoint to open the Signup screen
Author Colby Roberts
*/
const express = require('express');
const router = express.Router();
const Controller = require('../../controllers/views/signup');
const Middleware = require('../../../../middleware/views/main');

const BASE_PATH = '/signup';

router.get(BASE_PATH, Middleware.checkGuestAuth, Controller.render);

module.exports = router;