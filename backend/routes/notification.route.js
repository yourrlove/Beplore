const express = require('express');
const   router = express.Router();
const NotificationController = require('../controllers/notification.controller');
const asyncHandler = require('express-async-handler');
const { verifyToken } = require('../middlewares/verifyToken');

router.get('/:userId', verifyToken, asyncHandler( NotificationController.getAllNotifications ));
router.post('/', verifyToken, asyncHandler( NotificationController.createNotification ));
router.put('/', verifyToken, asyncHandler( NotificationController.updateReadNotification ));

module.exports = router;