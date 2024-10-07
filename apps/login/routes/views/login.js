const express = require('express');
const router = express.Router();
const Controller = require('../../controllers/views/login');

const BASE_PATH = '/login';

router.get(BASE_PATH, Controller.render);

module.exports = router;