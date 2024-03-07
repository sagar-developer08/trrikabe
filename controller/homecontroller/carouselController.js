const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
// const mongoose = require('mongoose');
const Document = require('../../models/home/carousel');
const config = require('../../config/config')
// Import necessary libraries

// Configure AWS SDK
AWS.config.update({
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
    region: 'ap-south-1'
});

// Create an instance of the S3 service
const s3 = new AWS.S3();

// Configure multer to handle file uploads
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'easytender',
        acl: 'public-read',
        key: function (req, file, cb) {
            cb(null, Date.now().toString()) // Use a unique key for each uploaded file
        }
    })
});

//create a logic to upload a file to s3 bucket and save in db
const imageUpload = (req, res) => {
    try {
        upload.single('file')(req, res, async function (err) {
            if (err) {
                console.error(err);
                return res.status(500).send('Failed to upload document');
            }
            const { name,carouselImages,isActive } = req.body;

            if (!req.file) {
                return res.status(400).send('No file uploaded');
            }

            const document = new Document({
                    name,
                    carouselImages: req.file.location,
                    isActive:req.body.isActive
            });
            const savedDocument = await document.save();
            res.status(200).json({ message: 'File uploaded and document saved successfully', document: savedDocument });
        });
    } catch (err) {
        console.log(err);
    }
}

const getImages = async (req, res) => {
    try {
        const documents = await Document.find();
        res.status(200).json(documents);
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to retrieve documents');
    }
}

const deleteImage = async(req, res) => {
    try{
        const { id } = req.params;
        const document = await Document.findByIdAndDelete(id);
        res.status(200).json({ message: 'Document deleted successfully', document });
    }catch(err){
        console.log(err)
    }
}

module.exports ={
    upload,
    getImages,
    imageUpload,
    deleteImage
}