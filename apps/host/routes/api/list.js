/*
Connects the API of the Edit screen to the Edit screen API controller
Author Colby Roberts
*/
const express = require('express');
const router = express.Router();
const Controller = require('../../controllers/api/list');
const APIMiddleware = require('../../../../middleware/api/main');

const BASE_PATH = '/api/host/list';

// GET
router.get(`${BASE_PATH}/get-upcoming-parties/:hostId`, APIMiddleware.checkIsHost, Controller.getUpcomingParties);
router.get(`${BASE_PATH}/get-past-parties/:hostId`, APIMiddleware.checkIsHost, Controller.getPastParties);
router.get(`${BASE_PATH}/get-party-link/:hostId/:partyId`, APIMiddleware.checkIsHost, Controller.getPartyLink);

module.exports = router;