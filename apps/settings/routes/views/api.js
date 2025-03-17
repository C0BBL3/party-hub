/*
Creates the endpoint to open the Password screen
Author Colby Roberts
*/
const express = require('express');
const router = express.Router();
const Middleware = require('../../../../middleware/views/main');
const Controller = require('../../controllers/views/api');

const BASE_PATH = '/settings/api';

router.get(BASE_PATH, Middleware.checkIsHostOrPatron, Controller.render);

module.exports = router;