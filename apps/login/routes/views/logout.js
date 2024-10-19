const express = require('express');
const router = express.Router();
const Controller = require('../../controllers/views/logout');
const Middleware = require('../../../../middleware/views/main');

const BASE_PATH = '/logout';

// POST 
router.get(BASE_PATH, Middleware.checkIsHostOrPatron, Controller.render);

module.exports = router;