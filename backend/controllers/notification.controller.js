const NotificationService = require('../services/notification.service');
const { CREATED, OK } = require('../core/success.response');

class NotificationController {
    createNotification = async (req, res, next) => {
        new CREATED({
            message: "Notification created successfully",
            metadata: await NotificationService.create(req.user._id, req.body)
        }).send(res);
    }

    getAllNotifications = async (req, res, next) => {
        console.log(req.query);
        new OK({
            message: 'Notifications retrieved successfully',
            metadata: await NotificationService.getAllByUserId(req.params.userId, req.query.isRead)
        }).send(res);
    }

    updateReadNotification = async (req, res, next) => {
        new OK({
            message: 'Notification updated successfully',
            metadata: await NotificationService.updateRead(req.user._id)
        }).send(res);
    }
}

module.exports = new NotificationController();