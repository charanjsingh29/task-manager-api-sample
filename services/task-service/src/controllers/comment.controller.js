const { 
    getComments,
    getSingleComment
} = require('../database/daos/comment.dao');
const { TaskHasComments } = require('../database/models');
const logger = require('../shared/utils/logger');
const axios = require('../shared/utils/axios');

exports.getAll = async (req, res) => {
    try {
        const comments = await getComments(req.params.id, req.user.id);
        res.json(comments);
    } catch (error) {
        logger.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.create = async (req, res) => {
    try {
        const { comment } = req.body;
        const task_id = req.params.id;
        const inserted = await TaskHasComments.create({
            task_id,
            comment,
            created_by: req.user.id
        });
        res.status(201).json(inserted);
    } catch (error) {
        console.log(error)
        logger.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
exports.update = async (req, res) => {
    try {
        const savedComment = await getSingleComment(req.params.id, req.user.id);
        if(savedComment.length === 0){
            return res.status(404).json({ message: 'Comment not found' });
        }
        const { comment } = req.body;
        savedComment.comment = comment;
        await savedComment.save();
        res.json(savedComment);
    } catch (error) {
        logger.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.delete = async (req, res) => {
    try {
        const savedComment = await getSingleComment(req.params.id, req.user.id);
        if(!savedComment){
            return res.status(404).json({ message: 'Comment not found' });
        }
        await savedComment.destroy();
        res.json({ message: 'Comment deleted' });
    }   catch (error) {
        logger.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


