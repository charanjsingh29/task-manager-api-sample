const { Team } = require('../database/models');
const logger = require('../shared/utils/logger');

// Get all teams
exports.getAll = async (req, res) => {
    try {
        const teams = await Team.findAll({
            where: {
                created_by: req.user.id
            }
        });
        res.json(teams);
    } catch (error) {
        logger.error('Get all teams error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get team by ID
exports.getById = async (req, res) => {
    try {
        const team = await Team.findByPk(req.params.id);
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
        const { name, manager_id } = req.body;
        const team = await Team.create({
            name,
            manager_id,
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
        const { name, manager_id } = req.body;
        const team = await Team.findByPk(req.params.id);
        
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        await team.update({
            name,
            manager_id
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
        const team = await Team.findByPk(req.params.id);
        
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
        const team = await Team.findByPk(req.params.id);
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        const { user_ids } = req.body;
        await team.addUsers(user_ids);

        res.json({ message: 'Users assigned successfully' });
    } catch (error) {
        logger.error('Assign users error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get all users in a team
exports.allUsers = async (req, res) => {
    try {
        const team = await Team.findByPk(req.params.id, {
            include: ['users']
        });
        
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        // Get detailed user information from user-service
        const userDetails = await Promise.all(
            team.users.map(async (user) => {
                try {
                    const response = await axios.get(
                        `http://user-service:3000/internal/user/${user.id}`,
                        {
                            headers: {
                                'x-internal-token': process.env.INTERNAL_SECRET_TOKEN
                            }
                        }
                    );
                    return response.data;
                } catch (error) {
                    logger.error(`Error fetching user ${user.id} details:`, error);
                    return {
                        id: user.id,
                        error: 'Failed to fetch user details'
                    };
                }
            })
        );

        res.json(userDetails);
    } catch (error) {
        logger.error('Get team users error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Remove user from team
exports.removeUser = async (req, res) => {
    try {
        const team = await Team.findByPk(req.params.id);
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        await team.removeUser(req.params.user_id);
        res.json({ message: 'User removed from team successfully' });
    } catch (error) {
        logger.error('Remove user from team error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};