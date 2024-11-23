const express = require('express');
const router = express.Router();
const Controller = require('../../controllers/api/rsvp');
const APIMiddleware = require('../../../../middleware/api/main');

const BASE_PATH = '/api/party/rsvp';

router.post(`${BASE_PATH}`, APIMiddleware.checkIsHostOrPatron, Controller.rsvp);
router.get(`${BASE_PATH}/:partyId/check/:patronId`, APIMiddleware.checkIsHostOrPatron, Controller.checkStatus);
router.post(`${BASE_PATH}/cancel`, APIMiddleware.checkIsHostOrPatron, Controller.cancel);

module.exports = router;