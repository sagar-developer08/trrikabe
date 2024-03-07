// const Services = require('../../models/home/services');
const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const Services = require('../../models/home/services');
const config = require('../../config/config');
// Create
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
// Create
exports.createService = async (req, res) => {
    const service = new Services(req.body);
    try {
        // Upload the image to S3 bucket
        upload.single('image')(req, res, async function (err) {
            if (err) {
            return res.status(400).send(err);
            }
            // Get the S3 object URL
            const imageUrl = req.file.location;
            // Store the URL in the database
            service.image = imageUrl;
            service.serviceName = req.body.serviceName;
            service.serviceDescription = req.body.serviceDescription;
            service.serviceImage = req.body.serviceImage;
            await service.save();
            res.status(201).send(service);
        });
    } catch (err) {
        res.status(400).send(err);
    }
};

// Read
exports.getServices = async (req, res) => {
    try {
        const services = await Services.find({});
        res.send(services);
    } catch (err) {
        res.status(500).send(err);
    }
};

exports.getService = async (req, res) => {
    try {
        const service = await Services.findById(req.params.id);
        if (!service) {
            return res.status(404).send();
        }
        res.send(service);
    } catch (err) {
        res.status(500).send(err);
    }
};

// Update
exports.updateService = async (req, res) => {
    try {
        const service = await Services.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!service) {
            return res.status(404).send();
        }
        res.send(service);
    } catch (err) {
        res.status(400).send(err);
    }
};

// Delete
exports.deleteService = async (req, res) => {
    try {
        const service = await Services.findByIdAndDelete(req.params.id);
        if (!service) {
            return res.status(404).send();
        }
        res.send(service);
    } catch (err) {
        res.status(500).send(err);
    }
};