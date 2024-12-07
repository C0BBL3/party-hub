/*
Connects the API of the Password screen to the Password screen API controller
Author Colby Roberts
*/
const express = require('express');
const router = express.Router();
const ApiMiddleware = require('../../../../middleware/api/main');
const Controller = require('../../controllers/api/password');

const BASE_PATH = '/api/settings/password';

// GET
router.get(`${BASE_PATH}/verify/:userId`, ApiMiddleware.checkAuth, Controller.verify);

// POST 
router.post(`${BASE_PATH}/update`, ApiMiddleware.checkAuth, Controller.update);

module.exports = router;