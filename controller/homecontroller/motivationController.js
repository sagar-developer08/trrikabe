const Motivation = require('../../models/home/motivation');
const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
// Create
const config = require('../../config/config')
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

const createMotivation = async (req, res) => {
    try {
        upload.single('file')(req, res, async function (err) {
            if (err) {
                console.error(err);
                return res.status(500).send('Failed to upload document');
            }
            const { Attribbute,Image,Headimg,content,bullet,isActive } = req.body;

            if (!req.file) {
                return res.status(400).send('No file uploaded');
            }

            const document = new Document({
                Attribbute,
                Image: req.file.location,
                Headimg,
                content,
                bullet,
                isActive
            });
            const savedDocument = await document.save();
            res.status(200).json({ message: 'File uploaded and document saved successfully', document: savedDocument });
        });
    } catch (err) {
        console.log(err);
    }
};

// Read
const getMotivations = async (req, res) => {
    try {
        const motivations = await Motivation.find({});
        res.send(motivations);
    } catch (err) {
        res.status(500).send(err);
    }
};

const getMotivation = async (req, res) => {
    try {
        const motivation = await Motivation.findById(req.params.id);
        if (!motivation) {
            return res.status(404).send();
        }
        res.send(motivation);
    } catch (err) {
        res.status(500).send(err);
    }
};

// Update
const updateMotivation = async (req, res) => {
    try {
        const motivation = await Motivation.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!motivation) {
            return res.status(404).send();
        }
        res.send(motivation);
    } catch (err) {
        res.status(400).send(err);
    }
};

// Delete
const deleteMotivation = async (req, res) => {
    try {
        const motivation = await Motivation.findByIdAndDelete(req.params.id);
        if (!motivation) {
            return res.status(404).send();
        }
        res.send(motivation);
    } catch (err) {
        res.status(500).send(err);
    }
};

module.exports={
    createMotivation,
    getMotivation,
    updateMotivation,
    deleteMotivation
}