const express = require('express');
const router = express.Router();
const Controller = require('../../controllers/api/feed');
const APIMiddleware = require('../../../../middleware/api/main');

const BASE_PATH = '/api/party/feed';

// GET
router.get(`${BASE_PATH}/get-first-10-parties`, APIMiddleware.checkIsHostOrPatron, Controller.getFirst10Parties);
router.get(`${BASE_PATH}/get-featured-parties`, APIMiddleware.checkIsHostOrPatron, Controller.getFeaturedParties);

module.exports = router;