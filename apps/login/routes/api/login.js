/*
Connects the API of the Login screen to the Login screen API controller
Author Colby Roberts
*/
const express = require('express');
const router = express.Router();
const Controller = require('../../controllers/api/login');

const BASE_PATH = '/api/login';

// POST 
router.post(`${BASE_PATH}`, Controller.login);


module.exports = router;