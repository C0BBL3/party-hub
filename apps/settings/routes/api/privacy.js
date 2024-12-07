/*
Connects the API of the Privacy screen to the Privacy screen API controller
Author Colby Roberts
*/
const express = require('express');
const router = express.Router();
const ApiMiddleware = require('../../../../middleware/api/main');
const Controller = require('../../controllers/api/privacy');

const BASE_PATH = '/api/settings/privacy';

// POST 
// router.post(`${BASE_PATH}/update`, ApiMiddleware.checkAuth, Controller.update);

module.exports = router;