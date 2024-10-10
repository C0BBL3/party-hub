const express = require('express');
const router = express.Router();
const Controller = require('../../controllers/views/feed');
const Middleware = require('../../../../middleware/views/main');

const BASE_PATH = '/party';

router.get(`${BASE_PATH}`, Middleware.checkIsHostOrPatron, (req, res, next) => { res.redirect(`${BASE_PATH}/feed`)});
router.get(`${BASE_PATH}/feed`, Middleware.checkIsHostOrPatron, Controller.render);

module.exports = router;