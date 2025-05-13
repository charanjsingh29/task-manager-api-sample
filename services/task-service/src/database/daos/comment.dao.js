const { Task, TaskHasComments } = require('../models');
const { Op } = require('sequelize');
const isMineCondition = (userId) => {
    return {
        [Op.or]: [
            { created_by: userId }
        ]
    }
}
const getComments = async (taskId, userId) => {
    let where = {};
    if(userId){
        where = isMineCondition(userId);
    }
    where.task_id = taskId;
    const comments = await TaskHasComments.findAll({
        where
    });
    return comments;
}

const getSingleComment = async (id, userId) => {
    let where = {};
    if(userId){
        where = isMineCondition(userId);
    }
    const comment = await TaskHasComments.findByPk(id, {
        where
    });
    return comment;
}

module.exports = {
    getComments,
    getSingleComment
}