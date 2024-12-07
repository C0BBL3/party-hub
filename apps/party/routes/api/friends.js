/*
Connects the API of the Friends screen to the Friends screen API controller
Author Colby Roberts
*/
const express = require('express');
const router = express.Router();
const Controller = require('../../controllers/api/friends');
const APIMiddleware = require('../../../../middleware/api/main');

const BASE_PATH = '/api/party/friends';

// GET
router.get(`${BASE_PATH}/:userId`, APIMiddleware.checkIsHostOrPatron, Controller.refresh);
router.get(`${BASE_PATH}/requests/:userId`, APIMiddleware.checkIsHostOrPatron, Controller.requests);
router.get(`${BASE_PATH}/search/:search`, APIMiddleware.checkIsHostOrPatron, Controller.search);

// POST
router.post(`${BASE_PATH}/accept`, APIMiddleware.checkIsHostOrPatron, Controller.accept);
router.post(`${BASE_PATH}/reject`, APIMiddleware.checkIsHostOrPatron, Controller.reject);


module.exports = router;