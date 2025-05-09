const { 
    getTasks, 
    getSingleTask,
    getTaskUsers,
    addUserToTask,
    removeUserFromTask
} = require('../database/daos/task.dao');
const { Task } = require('../database/models');
const logger = require('../shared/utils/logger');
const axios = require('../shared/utils/axios');

exports.getAll = async (req, res) => {
    try {
        const tasks = await getTasks(req.user.id);
        res.json(tasks);
    } catch (error) {
        logger.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.getById = async (req, res) => {
    try {
        const task = await getSingleTask(req.params.id, req.user.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json(task);
    } catch (error) {
        logger.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.create = async (req, res) => {
    try {
        const { title, description, due_date } = req.body;
        const task = await Task.create({
            title,
            description,
            due_date,
            created_by: req.user.id
        });
        res.status(201).json(task);
    } catch (error) {
        logger.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.update = async (req, res) => {
    try {
        const { title, description, due_date } = req.body;
        const task = await getSingleTask(req.params.id, req.user.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        task.title = title;
        task.description = description;
        task.due_date = due_date;
        await task.save();
        res.json(task);
    } catch (error) {
        logger.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.delete = async (req, res) => {
    try {
        const task = await getSingleTask(req.params.id, req.user.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        await task.destroy();
        res.json({ message: 'Task deleted' });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.assignUsers = async (req, res) => {
    try {
        const task = await getSingleTask(req.params.id, req.user.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const { emails } = req.body;

        // Get user IDs from user-service
        const response = await axios.post(
            `http://user-service:4001/internal/users_by_email`,
            {
                emails: emails
            }
        );
        const user_ids = response.data.users.map((user) => user.id);
        await addUserToTask(task.id, user_ids);

        res.json({ message: 'Users assigned successfully' });
    } catch (error) {
        if(error.response.status === 400){
            return res.status(400).json({
                not_allowed: error.response.data.not_allowed
            });
        }
        logger.error('Assign users error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get all users in a task
exports.allUsers = async (req, res) => {
    try {
        const task = await getTaskUsers(req.params.id, req.user.id);
        
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const userIds = task.users.map((user) => user.user_id);

        // Get detailed user information from user-service
        try {
            const response = await axios.post(
                `http://user-service:4001/internal/users`,
                {
                    user_ids: userIds
                }
            );
            res.json(response.data);
        } catch (error) {
            logger.error(`Error fetching allUsers:`, error);
            res.status(500).json({ message: 'Internal server error' });
        }

    } catch (error) {
        logger.error('Get team users error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Remove user from task
exports.removeUser = async (req, res) => {
    try {
        const task = await getSingleTask(req.params.id, req.user.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        await removeUserFromTask(req.params.id, req.params.user_id);
        res.json({ message: 'User removed from task successfully' });
    } catch (error) {
        logger.error('Remove user from task error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};