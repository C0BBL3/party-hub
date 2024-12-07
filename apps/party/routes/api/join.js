/*
Connects the API of the Join screen to the Join screen API controller
Author Colby Roberts
*/
const express = require('express');
const router = express.Router();
const Controller = require('../../controllers/api/join');
const APIMiddleware = require('../../../../middleware/api/main');

const BASE_PATH = '/api/party';

// GET
router.get(`${BASE_PATH}/:partyId/:patronId`, APIMiddleware.checkIsPatron, Controller.getParty);

module.exports = router;