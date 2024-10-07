const express = require('express');
const router = express.Router();
const Controller = require('../../controllers/views/view');
const Middleware = require('../../../../middleware/views/main');

const BASE_PATH = '/map';

router.post(`${BASE_PATH}`, Middleware.checkIsPatron, (req, res, next) => { res.redirect(`${BASE_PATH}/view`) });
router.post(`${BASE_PATH}/view`, Middleware.checkIsPatron, Controller.render);

module.exports = router;