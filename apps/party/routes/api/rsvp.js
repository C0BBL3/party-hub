/*
Connects the API of the RSVP screen to the RSVP screen API controller
Author Colby Roberts
*/
const express = require('express');
const router = express.Router();
const Controller = require('../../controllers/api/rsvp');
const APIMiddleware = require('../../../../middleware/api/main');

const BASE_PATH = '/api/party/rsvp';

// GET
router.get(`${BASE_PATH}/get-upcoming-parties/:patronId`, APIMiddleware.checkIsHost, Controller.getUpcomingParties);
router.get(`${BASE_PATH}/get-past-parties/:patronId`, APIMiddleware.checkIsHost, Controller.getPastParties);
router.get(`${BASE_PATH}/:partyId/check/:patronId`, APIMiddleware.checkIsHostOrPatron, Controller.checkStatus);
router.get(`${BASE_PATH}/get-RSVPed-parties/:patronId`, APIMiddleware.checkIsHostOrPatron, Controller.getRSVPedParties);

// POST
router.post(`${BASE_PATH}`, APIMiddleware.checkIsHostOrPatron, Controller.rsvp);
router.post(`${BASE_PATH}/cancel`, APIMiddleware.checkIsHostOrPatron, Controller.cancel);

module.exports = router;