const express = require('express');
const router = express.Router();
const { uploadDocuments, getVerificationStatus } = require('../controllers/verificationController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/upload').post(protect, upload.array('documents', 5), uploadDocuments);
router.route('/status').get(protect, getVerificationStatus);

module.exports = router;
