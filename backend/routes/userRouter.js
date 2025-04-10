const express = require('express');
const router = express.Router();
const { registerUser, loginUser, currentUser } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/current', protect, currentUser);

module.exports = router;
