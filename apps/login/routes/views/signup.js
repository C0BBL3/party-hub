const express = require('express');
const router = express.Router();
const Controller = require('../../controllers/views/signup');

const BASE_PATH = '/signup';

router.get(BASE_PATH, Controller.signup);

module.exports = router;