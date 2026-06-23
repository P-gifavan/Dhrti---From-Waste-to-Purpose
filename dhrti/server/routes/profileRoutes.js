const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, uploadVerificationDocuments, getPublicSupplierProfile } = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/')
  .get(protect, getProfile)
  .put(protect, updateProfile);

router.post('/upload-verification', protect, upload.array('documents', 5), uploadVerificationDocuments);
router.get('/supplier/:id', getPublicSupplierProfile);

module.exports = router;
