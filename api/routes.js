const express = require('express');
const router = express.Router();
const APIController = require('./api-controller');

const BASE_PATH = `/api`;

// GET
router.get(`${BASE_PATH}/patron/:patronId`, APIController.inspectRequest, APIController.scanForAnomaly, APIController.authenticateKey, APIController.getPatron);
router.get(`${BASE_PATH}/host/:hostId`, APIController.inspectRequest, APIController.scanForAnomaly, APIController.authenticateKey, APIController.getHost);
router.get(`${BASE_PATH}/featured-parties`, APIController.inspectRequest, APIController.scanForAnomaly, APIController.authenticateKey, APIController.getFeaturedParties);
router.get(`${BASE_PATH}/party/:partyId`, APIController.inspectRequest, APIController.scanForAnomaly, APIController.authenticateKey, APIController.getParty);

// POST
router.post(`${BASE_PATH}/party`, APIController.inspectRequest, APIController.scanForAnomaly, APIController.authenticateKey, APIController.authenticateSignature, APIController.postParty);
router.post(`${BASE_PATH}/party/update`, APIController.inspectRequest, APIController.scanForAnomaly, APIController.authenticateKey, APIController.authenticateSignature, APIController.updateParty);

module.exports = router;