/*
Connects the API of the Edit screen to the Edit screen API controller
Author Colby Roberts
*/
const express = require('express');
const router = express.Router();
const Controller = require('../../controllers/api/edit');
const APIMiddleware = require('../../../../middleware/api/main');

const BASE_PATH = '/api/host/edit';

// POST
router.post(`${BASE_PATH}/request-edit-party`, APIMiddleware.checkIsHost, Controller.requestEditParty);

module.exports = router;