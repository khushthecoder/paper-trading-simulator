const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { updateProfile, resetTpin } = require('../controllers/profileController');

router.put('/update', protect, updateProfile);
router.post('/reset-tpin', protect, resetTpin);

module.exports = router;
