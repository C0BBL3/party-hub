/*
Connects the API of the Signup screen to the Signup screen API controller
Author Colby Roberts
*/
const express = require('express');
const router = express.Router();
const Controller = require('../../controllers/api/signup');
const APIMiddleware = require('../../../../middleware/api/main');

const BASE_PATH = '/api/signup';

// POST 
router.post(`${BASE_PATH}/admin`, APIMiddleware.checkIsAdminOrSupervisorMode, Controller.createAdminAccount);
router.post(`${BASE_PATH}/host`, Controller.createHostAccount);
router.post(`${BASE_PATH}/patron`, Controller.createPatronAccount);

// GET
router.get(`${BASE_PATH}/check-if-unique-username/:username`, Controller.checkIfUniqueUsername);
router.get(`${BASE_PATH}/check-if-unique-email/:email`, Controller.checkIfUniqueEmail);

module.exports = router;