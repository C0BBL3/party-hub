const express = require('express');
const router = express.Router();
const Controller = require('../../controllers/api/signup');

const BASE_PATH = '/api/signup';

// POST 
router.post(`${BASE_PATH}`, Controller.signup);

module.exports = router;