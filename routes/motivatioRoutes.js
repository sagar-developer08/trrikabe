motivationController = require('../controller/homecontroller/motivationController'); 

const express = require('express');

const router = express.Router();


router.post('/create/motivation', motivationController.createMotivation);

router.get('/get/motivations',motivationController.getMotivation);



module.exports = router;
