const express = require('express');
const router = express.Router();
const ApiMiddleware = require('../../../../middleware/api/main');
const Controller = require('../../controllers/api/privacy');

const BASE_PATH = '/api/settings/privacy';

// POST 
router.post(`${BASE_PATH}/update`, ApiMiddleware.checkIsHostOrPatron, Controller.update);

module.exports = router;