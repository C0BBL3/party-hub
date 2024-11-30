const express = require('express');
const router = express.Router();
const ApiMiddleware = require('../../../../middleware/api/main');
const Controller = require('../../controllers/api/password');

const BASE_PATH = '/api/settings/password';

// POST 
router.post(`${BASE_PATH}/password`, ApiMiddleware.checkAuth, Controller.update);

module.exports = router;