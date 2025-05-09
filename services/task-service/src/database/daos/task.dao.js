const { Task, TaskHasUsers } = require('../models');
const { Op } = require('sequelize');

const isMineCondition = (userId) => {
    return {
        [Op.or]: [
            { created_by: userId }
        ]
    }
}

const getTasks = async (userId) => {
    let where = {};
    if(userId){
        where = isMineCondition(userId);
    }
    const tasks = await Task.findAll({
        where
    });
    return tasks;
}

const getSingleTask = async (id, userId) => {
    let where = {};
    if(userId){
        where = isMineCondition(userId);
    }
    const task = await Task.findByPk(id, {
        where
    });
    return task;
}

const getTaskUsers = async (taskId, userId) => {
    let where = {};
    if(userId){
        where = isMineCondition(userId);
    }
    const team = await Task.findByPk(taskId, {
        where,
        include: [
            {
                model: TaskHasUsers,
                as: 'users',
                attributes: ['user_id'],
                where: {
                    task_id: taskId
                }
            }
        ]
    });
    return team;
}

async function addUserToTask(taskId, userIds) {
    const payload = userIds.map(user_id => ({
      task_id: taskId,
      user_id: user_id,
    }));
  
    await TaskHasUsers.bulkCreate(payload, { ignoreDuplicates: true }); // or 'updateOnDuplicate' depending on use-case
}

async function removeUserFromTask(taskId, userId) {
    await TaskHasUsers.destroy({
      where: {
        task_id: taskId,
        user_id: userId,
      },
    });
}

module.exports = {
    getTasks,
    getSingleTask,
    getTaskUsers,
    addUserToTask,
    removeUserFromTask
}