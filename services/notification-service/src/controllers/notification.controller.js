const { UserHasNotification, Notification } = require('../database/models');
const { Op } = require('sequelize');
const logger = require('../shared/utils/logger');

exports.getAll = async (req, res) => {
  try {
    const keyword = req.query.keyword || '';
    const sortBy = req.query.sortBy || 'created_at';
    const sortOrder = req.query.sortOrder || 'desc';
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const userId = req.user.id;

    const offset = (page - 1) * limit;

    const { count, rows: notifications } = await UserHasNotification.findAndCountAll({
        include: [
          {
            model: Notification,
            as: 'notification',
            required: true
          }
        ],
      where: {
        user_id: {
          [Op.eq]: userId
        }
      },
      order: [[{ model: Notification, as: 'notification' }, sortBy, sortOrder]],
      limit,
      offset,
    }); 

    const unreadNotifications = await UserHasNotification.count({
      where: {
        user_id: userId,
        is_read: false
      }
    });

    res.json({
      notifications: notifications,
      unread_notifications: unreadNotifications,
      pagination: {
        total: count,
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        perPage: limit
      }
    });
  }
  catch (error) {
    logger.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Internal server error' }); 
  }
}

exports.markSeen = async (req, res) => {
  try {
    const { notifications } = req.body;
    const userId = req.user.id;
    const userHasNotification = await UserHasNotification.findAll({
      where: {
        notification_id: {
          [Op.in]: notifications
        },
        user_id: userId
      }
    });
    if (!userHasNotification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    await UserHasNotification.update({
      is_read: true,
    }, {
      where: {
        notification_id: {
          [Op.in]: notifications
        },
        user_id: userId
      }
    });
    res.json({ message: 'Notifications marked as read' });
  }
  catch (error) {
    logger.error('Error marking notification as read:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}