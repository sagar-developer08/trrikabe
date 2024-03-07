const express = require('express');
const router = express.Router();
const serviceController = require('../controller/homecontroller/serviceController');

// Create
router.post('/services', serviceController.createService);

// Read
router.get('/services', serviceController.getServices);
router.get('/services/:id', serviceController.getService);

// Update
router.put('/services/:id', serviceController.updateService);

// Delete
router.delete('/services/:id', serviceController.deleteService);

module.exports = router;