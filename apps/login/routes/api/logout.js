/*
Connects the API of the Logout route to the Logout route API controller
Author Colby Roberts
*/
const express = require('express');
const router = express.Router();
const ApiMiddleware = require('../../../../middleware/api/main');
const Controller = require('../../controllers/api/logout');

const BASE_PATH = '/api/logout';

// POST 
router.post(`${BASE_PATH}`, ApiMiddleware.checkIsHostOrPatron, Controller.logout);

module.exports = router;