const carouselController = require('../controller/homecontroller/carouselController');

const express = require('express');

const router = express.Router();


router.post('/addimage', carouselController.imageUpload);

router.get('/getimage', carouselController.getImages);

router.delete('/deleteimage/:id', carouselController.deleteImage);

module.exports = router;