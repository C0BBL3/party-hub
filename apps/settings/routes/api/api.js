/*
Connects the API of the Password screen to the Password screen API controller
Author Colby Roberts
*/
const express = require('express');
const router = express.Router();
const ApiMiddleware = require('../../../../middleware/api/main');
const Controller = require('../../controllers/api/api');

const BASE_PATH = '/api/settings/api';

// POST 
router.post(`${BASE_PATH}/create`, ApiMiddleware.checkAuth, Controller.linkUserToCustomer);

module.exports = router;