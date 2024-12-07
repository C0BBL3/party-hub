/*
Creates the endpoint to open the Edit screen
Author Colby Roberts
*/
const express = require('express');
const router = express.Router();
const Controller = require('../../controllers/views/edit');
const Middleware = require('../../../../middleware/views/main');

const BASE_PATH = '/host/edit';

router.get(BASE_PATH, Middleware.checkIsHost, Controller.render);

module.exports = router;