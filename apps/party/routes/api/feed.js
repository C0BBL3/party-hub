/*
Connects the API of the Feed screen to the Feed screen API controller
Author Colby Roberts
*/
const express = require('express');
const router = express.Router();
const Controller = require('../../controllers/api/feed');
const APIMiddleware = require('../../../../middleware/api/main');

const BASE_PATH = '/api/party/feed';

// GET
router.get(`${BASE_PATH}/get-first-10-parties`, APIMiddleware.checkIsHostOrPatron, Controller.getFirst10Parties);
router.get(`${BASE_PATH}/get-featured-parties`, APIMiddleware.checkIsHostOrPatron, Controller.getFeaturedParties);

// POST
router.post(`${BASE_PATH}/follow-host`, APIMiddleware.checkIsHostOrPatron, Controller.followHost);
router.post(`${BASE_PATH}/unfollow-host`, APIMiddleware.checkIsHostOrPatron, Controller.unfollowHost);

module.exports = router;