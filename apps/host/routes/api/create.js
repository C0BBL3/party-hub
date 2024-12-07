/*
Connects the API of the Create screen to the Create screen API controller
Author Colby Roberts
*/
const express = require('express');
const router = express.Router();
const Controller = require('../../controllers/api/create');
const APIMiddleware = require('../../../../middleware/api/main');

const BASE_PATH = '/api/host/create';

// GET
router.get(`${BASE_PATH}/check-if-unique-party-title/:partyTitle`, APIMiddleware.checkIsHost, Controller.checkIfUniquePartyTitle);

// POST
router.post(`${BASE_PATH}/request-create-party`, APIMiddleware.checkIsHost, Controller.requestCreateParty);

module.exports = router;