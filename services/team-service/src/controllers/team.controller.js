const { 
    getTeams, 
    getSingleTeam, 
    getTeamUsers,
    addUserToTeam,
    removeUserFromTeam
 } = require('../database/daos/team.dao');
const logger = require('../shared/utils/logger');
const axios = require('../shared/utils/axios');
const { USER_SERVICE_URL } = require('../shared/utils/constants');

// Get all teams
exports.getAll = async (req, res) => {
    try {
        const teams = await getTeams(req.user.id);
        res.json(teams);
    } catch (error) {
        logger.error('Get all teams error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get team by ID
exports.getById = async (req, res) => {
    try {
        const team = await getSingleTeam(req.params.id, req.user.id);
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }
        res.json(team);
    } catch (error) {
        logger.error('Get team by ID error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Create new team
exports.create = async (req, res) => {
    try {
        const { name } = req.body;
        const team = await Team.create({
            name,
            manager_id: req.user.id,
            created_by: req.user.id
        });
        res.status(201).json(team);
    } catch (error) {
        logger.error('Create team error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update team
exports.update = async (req, res) => {
    try {
        const { name } = req.body;
        const team = await getSingleTeam(req.params.id, req.user.id);

        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        await team.update({
            name,
        });

        res.json(team);
    } catch (error) {
        logger.error('Update team error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Delete team
exports.delete = async (req, res) => {
    try {
        const team = await getSingleTeam(req.params.id, req.user.id);
        
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        await team.destroy();
        res.json({ message: 'Team deleted successfully' });
    } catch (error) {
        logger.error('Delete team error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Assign users to team
exports.assignUsers = async (req, res) => {
    try {
        const team = await getSingleTeam(req.params.id, req.user.id);
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
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
        await addUserToTeam(team.id, user_ids);

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

// Get all users in a team
exports.allUsers = async (req, res) => {
    try {
        const team = await getTeamUsers(req.params.id, req.user.id);
        
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        const userIds = team.users.map((user) => user.user_id);

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

// Remove user from team
exports.removeUser = async (req, res) => {
    try {
        const team = await getSingleTeam(req.params.id, req.user.id);
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        await removeUserFromTeam(req.params.user_id);
        res.json({ message: 'User removed from team successfully' });
    } catch (error) {
        logger.error('Remove user from team error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};