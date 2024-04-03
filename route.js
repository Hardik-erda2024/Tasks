const express = require('express');
const router = express.Router();
const {register} = require('./app/controller/controller');
router.get('/',register);

module.exports = router;