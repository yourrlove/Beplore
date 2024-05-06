const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const asyncHandler = require('express-async-handler')
const { verifyToken } = require('../middlewares/verifyToken');

router.post('/signup', asyncHandler( userController.signUp ));
router.post('/login', asyncHandler( userController.logIn ));
router.get('/logout', asyncHandler( userController.logOut ));
router.get('/me', verifyToken, asyncHandler( userController.getMe));
router.get('/:username', asyncHandler( userController.getUserDetails ));
router.put('/profile/:userId', asyncHandler( userController.updateUserProfile ));
router.put('/follow/:targetUserId', verifyToken, asyncHandler( userController.updateUserFollow ));

module.exports = router;