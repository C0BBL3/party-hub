const express = require('express');
const router = express.Router();
const Controller = require('../../controllers/api/signup');
const APIMiddleware = require('../../../../middleware/api/main');

const BASE_PATH = '/api/signup';

// POST 
router.post(`${BASE_PATH}/admin`, APIMiddleware.checkIsAdminOrSupervisorMode, Controller.createAdminAccount);
router.post(`${BASE_PATH}/host`, Controller.createHostAccount);
router.post(`${BASE_PATH}/patron`, Controller.createPatronAccount);

module.exports = router;