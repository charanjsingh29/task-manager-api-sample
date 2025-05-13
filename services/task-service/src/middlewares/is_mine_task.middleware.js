const { getSingleTask } = require('../database/daos/task.dao');

module.exports = async (req, res, next) => {
    const { task_id } = req.params;
    const user_id = req.user.id;
    const task = await getSingleTask(task_id, user_id);
    console.log(task);
    if (!task) {
        return res.status(404).json({ message: 'Task not found' });
    }
    next();
}
